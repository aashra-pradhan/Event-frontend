import React from "react";
import { object, string, number, date } from "yup";

export const SchemaSignUp = object({
  fullName: string().required(),
  email: string().email().required(),
  password: string().required().min(8),
  mobileNum: string().length(10),
});

export const SchemaLogin = object({
  email: string().email().required(),
  password: string().required().min(8),
});

export const SchemaAddProducts = object({
  // userId: string().required(),
  // username: string().required(),
  shortDescription: string().required(),
  description: string().required(),
  requirements: string().required(),
  name: string().required(),
  quantity: number().required(),
  // quantity: string().required(),
});

export const SchemaPurchase = object({});
