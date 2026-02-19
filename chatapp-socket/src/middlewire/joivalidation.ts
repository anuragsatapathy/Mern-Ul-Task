import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";
import responses from "../utility/response";

const joiValidation = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);

    if (error) {
      responses.failedValidationResponse(res, error.details);
      return;
    }

    next();
  };
};

export default joiValidation;
