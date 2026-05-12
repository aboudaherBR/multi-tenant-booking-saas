const pool = require('./db');

async function findScheduleBlocksByProfessionalAndDate({
  companyId,
  professionalId,
  date
}) {
  const result = await pool.query(
    `
      SELECT 
        id,
        mode,
        start_date,
        end_date,
        start_time,
        end_time,
        recurring_days,
        valid_from,
        valid_to,
        time_scope
      FROM schedule_blocks
      WHERE company_id = $1
      AND (
        professional_id IS NULL
        OR professional_id = $2
      )
      AND (
        (
          mode = 'single'
          AND $3::date BETWEEN start_date AND end_date
        )
        OR
        (
          mode = 'recurring'
          AND EXTRACT(DOW FROM $3::date)::int = ANY(recurring_days)
          AND (valid_from IS NULL OR $3::date >= valid_from)
          AND (valid_to IS NULL OR $3::date <= valid_to)
        )
      )
    `,
    [companyId, professionalId, date]
  );

  return result.rows;
}

async function createScheduleBlock({
  companyId,
  professionalId,
  startDate,
  endDate,
  startTime,
  endTime,
  reason,
  mode,
  recurring_days,
  time_scope
}) {
  await pool.query(
    `
      INSERT INTO schedule_blocks (
        company_id,
        professional_id,
        start_date,
        end_date,
        start_time,
        end_time,
        reason,
        time_scope,
        mode,
        recurring_days
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10
      )
    `,
    [
      companyId,
      professionalId,
      startDate,
      endDate,
      startTime,
      endTime,
      reason,
      time_scope,
      mode,
      recurring_days
    ]
  );
}

async function findScheduleBlocksByCompany(companyId) {
  const result = await pool.query(
    `
      SELECT 
        sb.id,
        sb.professional_id,
        u.name AS professional_name,
        sb.start_date,
        sb.end_date,
        sb.start_time,
        sb.end_time,
        sb.reason,
        sb.mode,
        sb.time_scope,
        sb.recurring_days,
        sb.created_at

      FROM schedule_blocks sb

      LEFT JOIN professionals p
        ON p.id = sb.professional_id

      LEFT JOIN users u
        ON u.id = p.user_id

      WHERE sb.company_id = $1

      ORDER BY sb.start_date, sb.start_time
    `,
    [companyId]
  );

  return result.rows;
}

async function deleteScheduleBlock(companyId, blockId) {
  const result = await pool.query(
    `
      DELETE FROM schedule_blocks
      WHERE company_id = $1
      AND id = $2
      RETURNING id
    `,
    [companyId, blockId]
  );

  return result.rows[0] || null;
}

async function updateScheduleBlock({
  companyId,
  blockId,
  professionalId,
  startDate,
  endDate,
  startTime,
  endTime,
  reason
}) {
  const result = await pool.query(
    `
      UPDATE schedule_blocks
      SET professional_id = $3,
          start_date = $4,
          end_date = $5,
          start_time = $6,
          end_time = $7,
          reason = $8
      WHERE company_id = $1
      AND id = $2
      RETURNING id
    `,
    [
      companyId,
      blockId,
      professionalId,
      startDate,
      endDate,
      startTime,
      endTime,
      reason
    ]
  );

  return result.rows[0] || null;
}

async function hasScheduleBlockConflict({
  companyId,
  professionalId,
  startDate,
  endDate,
  startTime,
  endTime,
  ignoreBlockId = null
}) {
  const result = await pool.query(
    `
      SELECT id
      FROM schedule_blocks
      WHERE company_id = $1
      AND start_date <= $3
      AND end_date >= $2
      AND (
        professional_id IS NULL
        OR professional_id = $4
      )
      AND (
        ($5::time IS NULL OR $6::time IS NULL)
        OR
        (start_time IS NULL OR end_time IS NULL)
        OR
        (start_time < $6::time AND end_time > $5::time)
      )
      AND ($7::uuid IS NULL OR id <> $7)
      LIMIT 1
    `,
    [
      companyId,
      startDate,
      endDate,
      professionalId,
      startTime,
      endTime,
      ignoreBlockId
    ]
  );

  return result.rows.length > 0;
}

async function findApplicableScheduleBlocksForDate({
  companyId,
  professionalId,
  date
}) {
  console.log("PARAMS:", {
    companyId,
    professionalId,
    date,
    dateType: typeof date
  });

  const result = await pool.query(
    `
      SELECT 
        id,
        mode,
        start_date,
        end_date,
        start_time,
        end_time,
        recurring_days,
        valid_from,
        valid_to,
        time_scope
      FROM schedule_blocks
      WHERE company_id = $1
      AND (
        professional_id IS NULL
        OR professional_id = $2
      )
      AND (
        (
          mode = 'single'
          AND $3::date BETWEEN start_date AND end_date
        )
        OR
        (
          mode = 'recurring'
          AND EXTRACT(DOW FROM $3::date)::int = ANY(recurring_days)
          AND (valid_from IS NULL OR $3::date >= valid_from)
          AND (valid_to IS NULL OR $3::date <= valid_to)
        )
      )
    `,
    [companyId, professionalId, date]
  );

  return result.rows;
}

module.exports = {
  findScheduleBlocksByProfessionalAndDate,
  createScheduleBlock,
  findScheduleBlocksByCompany,
  deleteScheduleBlock,
  updateScheduleBlock,
  hasScheduleBlockConflict,
  findApplicableScheduleBlocksForDate
};