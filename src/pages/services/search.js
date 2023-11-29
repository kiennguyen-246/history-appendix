const keywords = [
    {
        id: 1,
        name: "cách mạng tư sản",
        content:
            "Cuộc cách mạng do giai cấp tư sản (hay quý tộc mới) lãnh đạo nhằm lật đổ chế độ phong kiến, thiết lập nền thống trị của giai cấp tư sản, mở đường cho sự phát triển của chủ nghĩa tư bản, theo học thuyết Mác.",
        pageNumber: 4,
        topic: 1,
        textbook: "Lịch sử 11 (Cánh diều)",
    },
    {
        id: 2,
        name: "chủ nghĩa tư bản",
        content:
            "Là một hệ thống kinh tế dựa trên quyền sở hữu tư nhân đối với tư liệu sản xuất và hoạt động sản xuất vì lợi nhuận.",
        pageNumber: 4,
        topic: 1,
        textbook: "Lịch sử 11 (Cánh diều)",
    },
    {
        id: 3,
        name: "Đồng minh",
        content:
            "Liên minh chính trị, quân sự quốc tế được thành lập trong Chiến tranh thế giới thứ hai, đứng đầu là Mỹ, Liên Xô, Anh nằm chiến đấu chống chủ nghĩa phát xít.",
        pageNumber: 37,
        topic: 3,
        textbook: "Lịch sử 11 (Cánh diều)",
    },
];

export async function getSearchResult(keyword) {
    for (let i = 0; i < keywords.length; i++) {
        if (keywords[i].name == keyword) {
            return keywords[i];
        }
    }
    return null;
}
