import {
  instanceOfErrorDTO,
  ErrorDTOFromJSON,
  ErrorDTOFromJSONTyped,
  ErrorDTOToJSON,
  ErrorDTOToJSONTyped,
  ErrorDTO,
} from "../../src/models/dto/ErrorDTO";

describe("ErrorDTO", () => {
  it("should return true for valid ErrorDTO object", () => {
    const obj = { code: 400, name: "BadRequest", message: "Invalid data" };
    expect(instanceOfErrorDTO(obj)).toBe(true);
  });

  it("should return false for object without code", () => {
    const obj = { message: "Missing code" };
    expect(instanceOfErrorDTO(obj)).toBe(false);
  });

  it("should convert JSON to ErrorDTO using ErrorDTOFromJSON", () => {
    const json = { code: 404, name: "NotFound", message: "Missing" };
    const dto = ErrorDTOFromJSON(json);
    expect(dto).toEqual(json);
  });

  it("should handle null in ErrorDTOFromJSONTyped gracefully", () => {
    const result = ErrorDTOFromJSONTyped(null, false);
    expect(result).toBeNull();
  });

  it("should convert ErrorDTO to JSON correctly", () => {
    const dto: ErrorDTO = { code: 500, name: "ServerError", message: "Oops" };
    const json = ErrorDTOToJSON(dto);
    expect(json).toEqual(dto);
  });

  it("should return null when ErrorDTOToJSONTyped called with null", () => {
    const result = ErrorDTOToJSONTyped(null, false);
    expect(result).toBeNull();
  });

  it("should handle missing optional fields when converting to and from JSON", () => {
    const json = { code: 401 };
    const dto = ErrorDTOFromJSON(json);
    expect(dto).toEqual({ code: 401, name: undefined, message: undefined });

    const backToJson = ErrorDTOToJSON(dto);
    expect(backToJson).toEqual({ code: 401, name: undefined, message: undefined });
  });
});
