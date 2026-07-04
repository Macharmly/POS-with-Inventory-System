"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const salesRoutes_1 = __importDefault(require("./routes/salesRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const financeRoutes_1 = __importDefault(require("./routes/financeRoutes"));
const reportRoutes_1 = __importDefault(require("./routes/reportRoutes"));
const logRoutes_1 = __importDefault(require("./routes/logRoutes"));
const patchNoteRoutes_1 = __importDefault(require("./routes/patchNoteRoutes"));
const businessRoutes_1 = __importDefault(require("./routes/businessRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/auth', authRoutes_1.default);
app.use('/api', salesRoutes_1.default);
app.use('/api/products', productRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/logs', logRoutes_1.default);
app.use('/api/finance', financeRoutes_1.default);
app.use('/api', reportRoutes_1.default);
app.use('/api/patch-notes', patchNoteRoutes_1.default);
app.use('/api', businessRoutes_1.default);
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Backend API is running'
    });
});
/* =========================
   Serve React / Vite Frontend
========================= */
const clientPath = path_1.default.join(__dirname, '..', 'dist');
app.use(express_1.default.static(clientPath));
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(clientPath, 'index.html'));
});
/* =========================
   Server Start
========================= */
const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, () => {
    console.log(`🚀 App running on port ${PORT}`);
});
