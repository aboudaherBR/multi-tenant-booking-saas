const reportsRepository = require('../database/reports.repository');

async function getSummary(req, res) {

    try {

        if (!req.session.user) {
            return res.status(401).json({
                message: "Usuário não autenticado"
            });
        }

        const companyId = req.session.user.companyId;

        const { startDate, endDate, professionalId } = req.query;
        if (!startDate || !endDate) {
            return res.status(400).json({
                message: "startDate e endDate são obrigatórios"
            });
        }

        const summary = await reportsRepository.getSummary({
            companyId,
            startDate,
            endDate,
            professionalId
        });

        res.json({
            totalServices: Number(summary.total_services),
            totalRevenue: Number(summary.total_revenue),
            ticketAverage: Number(summary.ticket_average)
        });

    } catch (error) {

        console.error("Erro ao gerar relatório", error);

        res.status(500).json({
            message: "Erro interno ao gerar relatório"
        });

    }

}

module.exports = {
    getSummary
};