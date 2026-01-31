"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvatarImage = getAvatarImage;
function getAvatarImage(currentImage, score) {
    const [color, rest] = currentImage.split('Level');
    const level = Math.min(14, Math.floor(score / 100) + 1);
    return `${color}Level${level}Abnahme.png`;
}
