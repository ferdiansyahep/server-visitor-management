const { PrismaClient } = require("@prisma/client");
const { GoogleGenAI } = require("@google/genai");
const prisma = new PrismaClient();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

class VisitorService {
    async calculateRiskScore(nik, waktu = new Date()) {
        const jam = waktu.getHours();
        let score = "GREEN";
        if (jam >= 22 || jam < 6) {
            score = "RED";
        } else if (jam >= 6 && jam < 9) {
            score = "YELLOW";
        } else if (jam >= 17 && jam < 22) {
            score = "YELLOW";
        }

        if (score !== "RED") {
            const startOfDay = new Date(waktu);
            startOfDay.setHours(0, 0, 0, 0);

            const countVisits = await prisma.visitor.count({
                where: {
                    nik: nik,
                    waktuMasuk: {
                        gte: startOfDay,
                    },
                },
            });

            if (countVisits >= 3) {
                score = "RED";
            }
            else if (countVisits === 2 && score === "GREEN") {
                score = "YELLOW";
            }
        }
        return score;
    }


    async createVisitor(data) {
        try {
            const waktuMasuk = data.waktuMasuk ? new Date(data.waktuMasuk) : new Date();
            const statusRisiko = await this.calculateRiskScore(data.nik, waktuMasuk);
            const visitorData = {
                ...data,
                waktuMasuk: waktuMasuk,
                statusRisiko: statusRisiko,
            };
            return await prisma.visitor.create({
                data: visitorData,
            });
        }
        catch (error) {
            console.error("Error creating visitor:", error);
            throw error;
        }
    }

    async getAllVisitors() {
        try {
            const visitors = await prisma.visitor.findMany();
            return visitors;
        } catch (error) {
            console.error("Error fetching visitors:", error);
            throw error;
        }
    }

    async getVisitorById(id) {
        try {
            const visitor = await prisma.visitor.findUnique({
                where: { id: Number(id) },
            });
            return visitor;
        } catch (error) {
            console.error("Error fetching visitor by ID:", error);
            throw error;
        }
    }
    async deleteVisitor(id) {
        try {
            const deletedVisitor = await prisma.visitor.delete({
                where: { id: Number(id) },
            });
            return deletedVisitor;
        }
        catch (error) {
            console.error("Error deleting visitor:", error);
            throw error;
        }
    }

    async generateAiSummary() {
        try {
            const startOfToday = new Date();
            startOfToday.setHours(0, 0, 0, 0);

            const visitors = await prisma.visitor.findMany({
                orderBy: {
                    waktuMasuk: "asc",
                },
                select: {
                    nama: true,
                    tujuan: true,
                    waktuMasuk: true,
                    statusRisiko: true,
                },
            });

            if (visitors.length === 0) {
                return "Belum ada aktivitas kunjungan hari ini.";
            }

            const data = visitors
                .map(
                    (v) =>
                        `- ${v.nama} | ${v.tujuan} | ${v.statusRisiko}`
                )
                .join("\n");

            const prompt = `
Kamu adalah AI Security Assistant.

Analisis data berikut dan buat ringkasan maksimal 3 kalimat.
Jika ada status RED atau YELLOW, berikan rekomendasi singkat.

${data}
`;

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
            });

            return response.text;
        } catch (error) {
            console.error("Gemini Error:", error);
            throw error;
        }

    }
}

module.exports = new VisitorService();