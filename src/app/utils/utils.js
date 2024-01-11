export function removeTone(str) {
    if (typeof str !== "string") return "";
    return str
        .toLowerCase()
        .replace("đ", "d")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}
