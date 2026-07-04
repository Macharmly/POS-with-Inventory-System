"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbConnection_1 = __importDefault(require("../dbConnection"));
const logActivity = async ({ user_id, business_id, module, action, description }) => {
    try {
        await dbConnection_1.default.promise().query(`
        INSERT INTO activity_logs
        (
          user_id,
          business_id,
          module,
          action,
          description
        )
        VALUES (?, ?, ?, ?, ?)
      `, [
            user_id,
            business_id,
            module,
            action,
            description
        ]);
    }
    catch (error) {
        console.error('Failed to create activity log:', error);
    }
};
exports.default = logActivity;
