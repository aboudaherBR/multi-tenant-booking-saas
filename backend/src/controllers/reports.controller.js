const reportsRepository = require('../database/reports.repository');

async function getSummary(req, res) {
    try {
        // 🔒 Segurança básica
        if (!req.user) {
            return res.status(401).json({
                message: "Usuário não autenticado"
            });
        }

        const companyId = req.user.companyId;

        // ✅ EXTRAÇÃO COMPLETA (incluindo serviceId)
        const { startDate, endDate, professionalId, serviceId } = req.query;

        // 🧪 LOG 1 - entrada real
        console.log("QUERY RECEBIDA NO CONTROLLER:", req.query);

        // 🔒 Validação obrigatória
        if (!startDate || !endDate) {
            return res.status(400).json({
                message: "startDate e endDate são obrigatórios"
            });
        }

        // 🧠 NORMALIZAÇÃO (micro melhoria sem risco)
        const filters = {
            companyId,
            startDate,
            endDate,
            professionalId: professionalId || null,
            serviceId: serviceId || null
        };

        // 🧪 LOG 2 - saída controlada
        console.log("PARAMS ENVIADOS PARA REPOSITORY:", filters);

        const summary = await reportsRepository.getSummary(filters);

        return res.json({
            totalServices: Number(summary.total_services),
            totalRevenue: Number(summary.total_revenue),
            ticketAverage: Number(summary.ticket_average)
        });

    } catch (error) {
        console.error("Erro ao gerar relatório", error);

        return res.status(500).json({
            message: "Erro interno ao gerar relatório"
        });
    }
}

module.exports = {
    getSummary
};