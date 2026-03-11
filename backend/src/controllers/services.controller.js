const pool = require('../database/db');

/*
========================
LISTAR SERVIÇOS
GET /services
========================
*/
async function list(req, res) {

    try {

        const companyId = req.session.user.companyId;

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

        const companyId = req.session.user.companyId;

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

        res.json({
            service: result.rows[0]
        });

    } catch (error) {

        console.error("ERRO CREATE SERVICE:", error);

        res.status(500).json({
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

        const companyId = req.session.company_id;
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

        const companyId = req.session.user.companyId;
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