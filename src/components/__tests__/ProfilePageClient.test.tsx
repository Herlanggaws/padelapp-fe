import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProfilePageClient from "@/components/ProfilePageClient";
import * as authService from "@/services/authService";
import * as storageService from "@/services/storageService";
import * as cache from "@/lib/userProfileCache";
import type { UserProfile } from "@/types/auth";

const mockShowSnackbar = vi.fn();
vi.mock("@/context/SnackbarContext", () => ({
  useSnackbar: () => ({
    showSnackbar: mockShowSnackbar,
  }),
}));

vi.mock("@/services/authService", () => ({
  fetchUserProfile: vi.fn(),
  updateUserProfile: vi.fn(),
}));

vi.mock("@/services/storageService", () => ({
  uploadFile: vi.fn(),
}));

const mockCroppedFile = new File(["cropped"], "cropped.jpg", {
  type: "image/jpeg",
});

vi.mock("@/lib/cropImage", () => ({
  getCroppedImg: vi.fn().mockImplementation(async () => mockCroppedFile),
}));

vi.mock("react-easy-crop", () => ({
  default: ({
    onCropComplete,
  }: {
    onCropComplete: (crop: unknown, pixels: unknown) => void;
  }) => {
    const React = require("react");
    React.useEffect(() => {
      onCropComplete(
        { x: 0, y: 0, width: 100, height: 100 },
        { x: 0, y: 0, width: 200, height: 200 },
      );
    }, []);
    return <div data-testid="mock-cropper">Cropper</div>;
  },
}));

beforeEach(() => {
  if (!global.URL.createObjectURL) {
    global.URL.createObjectURL = vi.fn(() => "blob:mock-image-url");
  } else {
    vi.spyOn(global.URL, "createObjectURL").mockReturnValue("blob:mock-image-url");
  }
  if (!global.URL.revokeObjectURL) {
    global.URL.revokeObjectURL = vi.fn();
  } else {
    vi.spyOn(global.URL, "revokeObjectURL").mockImplementation(() => {});
  }
});

vi.mock("@/services/clubService", () => ({
  fetchJoinedClubs: vi.fn().mockResolvedValue({ data: [] }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  usePathname: () => "/profile",
}));

describe("ProfilePageClient (T20)", () => {
  it("T20-AC1: displays rating cards for preferred sports and any sport with events played", async () => {
    const mockProfile: UserProfile = {
      guid: "u1",
      name: "Tennis & Padel Player",
      email: "player@example.com",
      profile_photo: "",
      verified_at: "2026-01-01",
      is_active: true,
      active_at: "2026-01-01",
      active_by: null,
      rank_points: 6.2,
      events_played: 12,
      preferred_sports: "both",
      rank_points_by_sport: {
        padel: { rank_points: 6.2, events_played: 10 },
        tennis: { rank_points: 4.5, events_played: 2 },
      },
      created_at: "2026-01-01",
      created_by: null,
      updated_at: null,
      updated_by: null,
    };

    vi.spyOn(authService, "fetchUserProfile").mockResolvedValue({
      data: mockProfile,
      message: "success",
    });
    vi.spyOn(cache, "getUserProfileCache").mockReturnValue(mockProfile);

    render(<ProfilePageClient />);

    await waitFor(() => {
      expect(screen.getByText(/Padel 6.2/i)).toBeInTheDocument();
      expect(screen.getByText(/Tennis 4.5/i)).toBeInTheDocument();
    });
  });

  it("T20-AC6: falls back to legacy rank_points labelled Padel if rank_points_by_sport is missing", async () => {
    const legacyProfile: UserProfile = {
      guid: "u2",
      name: "Legacy User",
      email: "legacy@example.com",
      profile_photo: "",
      verified_at: "2026-01-01",
      is_active: true,
      active_at: "2026-01-01",
      active_by: null,
      rank_points: 5.1,
      events_played: 8,
      created_at: "2026-01-01",
      created_by: null,
      updated_at: null,
      updated_by: null,
    };

    vi.spyOn(authService, "fetchUserProfile").mockResolvedValue({
      data: legacyProfile,
      message: "success",
    });
    vi.spyOn(cache, "getUserProfileCache").mockReturnValue(legacyProfile);

    render(<ProfilePageClient />);

    await waitFor(() => {
      expect(screen.getByText(/Padel 5.1/i)).toBeInTheDocument();
    });
  });

  beforeEach(() => {
    vi.clearAllMocks();
    window.URL.createObjectURL = vi.fn().mockReturnValue("blob:mock-url");
    window.URL.revokeObjectURL = vi.fn();
  });

  it("opens crop modal when an image is selected, crops and updates profile photo", async () => {
    const user = userEvent.setup();
    const mockProfile: UserProfile = {
      guid: "u1",
      name: "Test User",
      email: "test@example.com",
      profile_photo: "",
      verified_at: "2026-01-01",
      is_active: true,
      active_at: "2026-01-01",
      active_by: null,
      rank_points: 5.0,
      events_played: 1,
      preferred_sports: "padel",
      created_at: "2026-01-01",
      created_by: null,
      updated_at: null,
      updated_by: null,
    };

    vi.spyOn(authService, "fetchUserProfile").mockResolvedValue({
      data: mockProfile,
      message: "success",
    });
    vi.spyOn(cache, "getUserProfileCache").mockReturnValue(mockProfile);

    vi.mocked(storageService.uploadFile).mockResolvedValue({
      data: {
        file: { url: "https://storage.example.com/new-photo.jpg", path: "new-photo.jpg" },
      } as unknown as storageService.UploadFileSuccessData,
      message: "Uploaded",
    });

    vi.mocked(authService.updateUserProfile).mockResolvedValue({
      data: { ...mockProfile, profile_photo: "https://storage.example.com/new-photo.jpg" },
      message: "Updated",
    });

    render(<ProfilePageClient />);

    await waitFor(() => {
      expect(screen.getByText("Test User")).toBeInTheDocument();
    });

    const fileInput = screen.getByTestId("profile-photo-input");
    const testFile = new File(["dummy content"], "photo.png", { type: "image/png" });

    fireEvent.change(fileInput, { target: { files: [testFile] } });

    // Crop modal should appear
    await waitFor(() => {
      expect(screen.getByText("Crop Profile Picture")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Save Photo" })).toBeInTheDocument();
    });

    // Click Save Photo
    const saveBtn = screen.getByRole("button", { name: "Save Photo" });
    await user.click(saveBtn);

    await waitFor(() => {
      expect(storageService.uploadFile).toHaveBeenCalledWith(mockCroppedFile);
      expect(authService.updateUserProfile).toHaveBeenCalledWith({
        profile_photo: "https://storage.example.com/new-photo.jpg",
      });
      expect(mockShowSnackbar).toHaveBeenCalledWith("Profile picture updated successfully!");
    });
  });

  it("closes crop modal without uploading when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const mockProfile: UserProfile = {
      guid: "u1",
      name: "Test User",
      email: "test@example.com",
      profile_photo: "",
      verified_at: "2026-01-01",
      is_active: true,
      active_at: "2026-01-01",
      active_by: null,
      rank_points: 5.0,
      events_played: 1,
      preferred_sports: "padel",
      created_at: "2026-01-01",
      created_by: null,
      updated_at: null,
      updated_by: null,
    };

    vi.spyOn(authService, "fetchUserProfile").mockResolvedValue({
      data: mockProfile,
      message: "success",
    });
    vi.spyOn(cache, "getUserProfileCache").mockReturnValue(mockProfile);

    render(<ProfilePageClient />);

    await waitFor(() => {
      expect(screen.getByText("Test User")).toBeInTheDocument();
    });

    const fileInput = screen.getByTestId("profile-photo-input");
    const testFile = new File(["dummy content"], "photo.png", { type: "image/png" });

    fireEvent.change(fileInput, { target: { files: [testFile] } });

    await waitFor(() => {
      expect(screen.getByText("Crop Profile Picture")).toBeInTheDocument();
    });

    // Click Cancel
    const cancelBtn = screen.getByRole("button", { name: "Cancel" });
    await user.click(cancelBtn);

    await waitFor(() => {
      expect(screen.queryByText("Crop Profile Picture")).not.toBeInTheDocument();
      expect(storageService.uploadFile).not.toHaveBeenCalled();
    });
  });

  it("shows error snackbar when selected file has invalid type", async () => {
    const mockProfile: UserProfile = {
      guid: "u1",
      name: "Test User",
      email: "test@example.com",
      profile_photo: "",
      verified_at: "2026-01-01",
      is_active: true,
      active_at: "2026-01-01",
      active_by: null,
      rank_points: 5.0,
      events_played: 1,
      preferred_sports: "padel",
      created_at: "2026-01-01",
      created_by: null,
      updated_at: null,
      updated_by: null,
    };

    vi.spyOn(authService, "fetchUserProfile").mockResolvedValue({
      data: mockProfile,
      message: "success",
    });
    vi.spyOn(cache, "getUserProfileCache").mockReturnValue(mockProfile);

    render(<ProfilePageClient />);

    const fileInput = screen.getByTestId("profile-photo-input");
    const pdfFile = new File(["dummy pdf"], "doc.pdf", { type: "application/pdf" });

    fireEvent.change(fileInput, { target: { files: [pdfFile] } });

    await waitFor(() => {
      expect(mockShowSnackbar).toHaveBeenCalledWith("Only JPG, PNG, or WebP files are allowed.");
      expect(storageService.uploadFile).not.toHaveBeenCalled();
    });
  });
});
