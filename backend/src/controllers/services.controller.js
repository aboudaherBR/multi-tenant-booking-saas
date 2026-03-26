const pool = require('../database/db');

/*
========================
LISTAR SERVIÇOS
GET /services
========================
*/
async function list(req, res) {

    try {

        const companyId = req.user.companyId;

        const result = await pool.query(
            `
            SELECT
                id,
                name,
                duration_minutes,
                base_price
            FROM services
            WHERE company_id = $1
            AND is_active = true
            ORDER BY name
            `,
            [companyId]
        );

        res.json({
            services: result.rows
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Erro interno ao listar serviços"
        });
    }

}


/*
========================
CRIAR SERVIÇO
POST /services
========================
*/
async function create(req, res) {
    console.log("BODY RECEIVED:", req.body);

    try {

        const companyId = req.user.companyId;

        const {
            name,
            duration_minutes,
            base_price
        } = req.body;

        const slug = name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, "-");

        // 🔥 1. VERIFICAR SE JÁ EXISTE
        const existing = await pool.query(
            `
            SELECT id, is_active
            FROM services
            WHERE company_id = $1 AND slug = $2
            LIMIT 1
            `,
            [companyId, slug]
        );

        if (existing.rows.length > 0) {

            const service = existing.rows[0];

            // 🔴 já existe ativo → erro
            if (service.is_active) {
                return res.status(409).json({
                    message: "Já existe um serviço com esse nome"
                });
            }

            // 🟢 existe mas está inativo → REATIVAR
            const updated = await pool.query(
                `
                UPDATE services
                SET 
                    name = $1,
                    duration_minutes = $2,
                    base_price = $3,
                    is_active = true
                WHERE id = $4
                RETURNING id, name, duration_minutes, base_price
                `,
                [
                    name,
                    duration_minutes,
                    base_price,
                    service.id
                ]
            );

            return res.json({
                service: updated.rows[0],
                reactivated: true
            });
        }

        // 🔵 NÃO EXISTE → INSERT NORMAL
        const result = await pool.query(
            `
            INSERT INTO services
            (
                company_id,
                name,
                duration_minutes,
                base_price,
                slug
            )
            VALUES ($1,$2,$3,$4,$5)
            RETURNING id,name,duration_minutes,base_price
            `,
            [
                companyId,
                name,
                duration_minutes,
                base_price,
                slug
            ]
        );

        return res.json({
            service: result.rows[0]
        });

    } catch (error) {

        console.error("🔥 CREATE SERVICE ERROR:", error);

        return res.status(500).json({
            message: "Erro interno ao criar serviço"
        });
    }
}


/*
========================
ATUALIZAR SERVIÇO
PUT /services/:id
========================
*/
async function update(req, res) {

    try {

        const companyId = req.user.companyId;
        const serviceId = req.params.id;

        const {
            name,
            duration_minutes,
            base_price
        } = req.body;

        await pool.query(
            `
            UPDATE services
            SET
                name = $1,
                duration_minutes = $2,
                base_price = $3
            WHERE id = $4
            AND company_id = $5
            `,
            [
                name,
                duration_minutes,
                base_price,
                serviceId,
                companyId
            ]
        );

        res.json({
            message: "Service updated successfully"
        });

    } catch (error) {

        console.error("Erro ao atualizar serviço:", error);

        res.status(500).json({
            message: "Erro interno ao atualizar serviço"
        });

    }

}


/*
========================
REMOVER SERVIÇO
DELETE /services/:id
========================
*/
async function remove(req, res) {

    try {

        const companyId = req.user.companyId;
        const serviceId = req.params.id;

        await pool.query(
            `
            UPDATE services
            SET is_active = false
            WHERE id = $1
            AND company_id = $2
            `,
            [
                serviceId,
                companyId
            ]
        );

        res.json({
            message: "Service removed successfully"
        });

    } catch (error) {

        console.error("Erro ao remover serviço:", error);

        res.status(500).json({
            message: "Erro interno ao remover serviço"
        });

    }

}

module.exports = {
    list,
    create,
    update,
    remove
};