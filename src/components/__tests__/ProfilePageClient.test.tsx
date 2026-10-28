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

  it("uploads and updates profile photo when a valid image is selected", async () => {
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

    await waitFor(() => {
      expect(storageService.uploadFile).toHaveBeenCalledWith(testFile);
      expect(authService.updateUserProfile).toHaveBeenCalledWith({
        profile_photo: "https://storage.example.com/new-photo.jpg",
      });
      expect(mockShowSnackbar).toHaveBeenCalledWith("Profile picture updated successfully!");
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
