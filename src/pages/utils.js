export function removeTone(str) {
    if (typeof str !== "string") return "";
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}
