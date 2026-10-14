import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateEventForm from "@/components/CreateEventForm";
import * as eventService from "@/services/eventService";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockShowSnackbar = vi.fn();
vi.mock("@/context/SnackbarContext", () => ({
  useSnackbar: () => ({
    showSnackbar: mockShowSnackbar,
  }),
}));

vi.mock("@/services/eventService", () => ({
  createEvent: vi.fn(),
}));

vi.mock("@/services/clubService", () => ({
  fetchClubDetail: vi.fn(),
}));

describe("CreateEventForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("T19-AC1: in a 'both' club shows Padel/Tennis selector and sends selected sport", async () => {
    const user = userEvent.setup();
    vi.mocked(eventService.createEvent).mockResolvedValue({
      data: null,
      message: "Event created successfully",
    });

    render(
      <CreateEventForm
        clubGuid="club-both"
        clubId="club-both"
        clubSportType="both"
      />,
    );

    // Selector should be visible
    const padelOption = screen.getByRole("radio", { name: "Padel" });
    const tennisOption = screen.getByRole("radio", { name: "Tennis" });
    expect(padelOption).toBeInTheDocument();
    expect(tennisOption).toBeInTheDocument();

    // Select Tennis
    await user.click(tennisOption);
    expect(tennisOption).toHaveAttribute("aria-checked", "true");

    // Fill form
    await user.type(screen.getByPlaceholderText(/Friday Morning Smash/i), "Tennis Open");
    await user.type(screen.getByPlaceholderText(/Input Number of Players/i), "8");

    // We need to set a datetime
    const dateTimeInput = document.querySelector('input[type="datetime-local"]') as HTMLInputElement;
    expect(dateTimeInput).not.toBeNull();
    await user.type(dateTimeInput, "2026-11-01T10:00");

    const submitBtn = screen.getByRole("button", { name: /Save/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(eventService.createEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          club_guid: "club-both",
          name: "Tennis Open",
          sport: "tennis",
        }),
      );
    });
  });

  it("T19-AC1: in a single-sport club (tennis) hides selector and defaults to that sport", async () => {
    const user = userEvent.setup();
    vi.mocked(eventService.createEvent).mockResolvedValue({
      data: null,
      message: "Event created successfully",
    });

    render(
      <CreateEventForm
        clubGuid="club-tennis"
        clubId="club-tennis"
        clubSportType="tennis"
      />,
    );

    // Selector should be hidden
    expect(screen.queryByRole("radio", { name: "Padel" })).not.toBeInTheDocument();
    expect(screen.queryByRole("radio", { name: "Tennis" })).not.toBeInTheDocument();

    // Fill form
    await user.type(screen.getByPlaceholderText(/Friday Morning Smash/i), "Tennis Single Club Event");
    await user.type(screen.getByPlaceholderText(/Input Number of Players/i), "4");

    const dateTimeInput = document.querySelector('input[type="datetime-local"]') as HTMLInputElement;
    await user.type(dateTimeInput, "2026-11-01T10:00");

    const submitBtn = screen.getByRole("button", { name: /Save/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(eventService.createEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          club_guid: "club-tennis",
          name: "Tennis Single Club Event",
          sport: "tennis",
        }),
      );
    });
  });

  it("T19-AC1: in a single-sport club (padel) hides selector and defaults to padel", async () => {
    const user = userEvent.setup();
    vi.mocked(eventService.createEvent).mockResolvedValue({
      data: null,
      message: "Event created successfully",
    });

    render(
      <CreateEventForm
        clubGuid="club-padel"
        clubId="club-padel"
        clubSportType="padel"
      />,
    );

    expect(screen.queryByRole("radio", { name: "Padel" })).not.toBeInTheDocument();

    await user.type(screen.getByPlaceholderText(/Friday Morning Smash/i), "Padel Event");
    await user.type(screen.getByPlaceholderText(/Input Number of Players/i), "4");

    const dateTimeInput = document.querySelector('input[type="datetime-local"]') as HTMLInputElement;
    await user.type(dateTimeInput, "2026-11-01T10:00");

    const submitBtn = screen.getByRole("button", { name: /Save/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(eventService.createEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          club_guid: "club-padel",
          sport: "padel",
        }),
      );
    });
  });
});
