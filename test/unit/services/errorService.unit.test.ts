import { createAppError, createErrorDTO } from "../../../src/services/errorService";
import { AppError } from "../../../src/models/errors/AppError";

jest.mock("../../../src/services/loggingService", () => ({
  logError: jest.fn(),
}));

describe("errorService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a default 500 ErrorDTO for generic errors", () => {
    const error = new Error("Something went wrong");
    const result = createAppError(error);

    expect(result.code).toBe(500);
    expect(result.name).toBe("InternalServerError");
    expect(result.message).toBe("Something went wrong");
  });

  it("should create an ErrorDTO from AppError instance", () => {
    const appError = new AppError("Invalid input",400);
    const result = createAppError(appError);

    expect(result.code).toBe(400);
   
    expect(result.message).toBe("Invalid input");
  });

  it("should create an ErrorDTO for error with status property", () => {
    const err = { status: 401, message: "Unauthorized", name: "AuthError" };
    const result = createAppError(err);

    expect(result.code).toBe(401);
    expect(result.name).toBe("AuthError");
    expect(result.message).toBe("Unauthorized");
  });

  it("should create an ErrorDTO manually using createErrorDTO", () => {
    const result = createErrorDTO(404, "Not found", "NotFoundError");

    expect(result).toEqual({
      code: 404,
      message: "Not found",
      name: "NotFoundError",
    });
  });
});
