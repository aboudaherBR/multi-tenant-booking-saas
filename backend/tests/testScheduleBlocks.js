require("dotenv").config({ path: "../.env" });

const { findApplicableScheduleBlocksForDate } = require("../src/database/scheduleBlocks.repository");

async function test() {
    console.log("DATABASE_URL:", process.env.DATABASE_URL);
    const result = await findApplicableScheduleBlocksForDate({
        companyId: "1d5bad04-c455-49d3-bd0c-35c135666944",
        professionalId: "d6ef5b8e-6887-4c34-ac56-0ff073bd1ef1",
        date: "2026-06-01"
    });

    console.log("RESULTADO:", result);
}

test().then(() => process.exit());