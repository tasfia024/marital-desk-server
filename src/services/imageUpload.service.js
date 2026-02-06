import fs from "fs";
import path from "path";

export function handleSingleImageUpload(file, oldImagePath = null) {
    if (!file) return null;

    // Delete old image if exists
    if (oldImagePath) {
        const oldPath = path.join(process.cwd(), oldImagePath);
        if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
        }
    }

    return `/uploads/${file.filename}`;
}
