import sql from "mssql";
import 'dotenv/config.js'
import {createTicket} from "./TicketService.js";

const dbconnstr = process.env.CONNECTION_STRING;

class GetService {

	static wakeword = async () => {
		try {
			await sql.connect(dbconnstr)
			return await sql.query("SELECT TOP 1 * FROM [dbo].[Category]")
		} catch (e) {
			console.error("Failed to connect to database:", e)
			throw e
		}
		finally {
			await sql.close()
		}
	}
	static GetActivities = async () => {
		await sql.connect(dbconnstr)

		try {
			const result = await sql.query(
				`
                    SELECT Act.[ActivityId],
                           Act.[Title] AS "ActivityName",
                           Act.[Description],
                           Act.[ImageName],
                           FORMAT(Act.[EventStart], 'dd, MMMM yyy - HH:mm') as 'EventStart', FORMAT(Act.[EventEnd], 'dd, MMMM yyy - HH:mm') as EventEnd,
                           Cat.[CategoryId],
                           Cat.[Title] As "Category",
                           Org.[OrganizerId],
                           Org.[Name]  As "Organizer"
                    from [dbo].[Activity] Act
                        INNER JOIN [dbo].[Category] Cat
                    ON Act.[CategoryId] = Cat.[CategoryId]
                        INNER JOIN [dbo].[Organizer] Org on Act.[OrganizerId] = Org.[OrganizerId]
                    WHERE ACT.[ImageName] != ' '
                    ORDER BY Act.[EventStart] Asc`
			)

			return result.recordsets[0]

		} catch (e) {
			console.error(e)
		} finally {
			await sql.close()
		}
	}

	static GetActivityById = async (id) => {
		await sql.connect(dbconnstr)
		try {
			const result = await sql.query(
				`SELECT TOp 1 Act.[ActivityId], Act.[Title] AS "ActivityName",
                        Act.[Description],
                        Act.[ImageName],
                        FORMAT(Act.[EventStart], 'dd, MMMM yyy - HH:mm') as 'EventStart', FORMAT(Act.[EventEnd], 'dd, MMMM yyy - HH:mm') as EventEnd,
                        Cat.[CategoryId],
                        Cat.[Title] As "Category",
                        Org.[OrganizerId],
                        Org.[Name]  As "Organizer"
                 from [dbo].[Activity] Act
                     INNER JOIN [dbo].[Category] Cat
                 ON Act.[CategoryId] = Cat.[CategoryId]
                     INNER JOIN [dbo].[Organizer] Org on Act.[OrganizerId] = Org.[OrganizerId]
                 WHERE Act.[ActivityId] = ${id}`
			)
			
			return result.recordsets[0]
		} catch (e) {
			console.error(e)
		} finally {
			await sql.close()
		}
	}

	static GetActivityPurchases = async (id) => {
		await sql.connect(dbconnstr)
		try {
			const result = await sql.query(`SELECT *
                                    FROM [dbo].[Purchase]
                                    WHERE ActivityId = ${id}`)
			
			return result.recordsets[0]
		}
		catch (e) {
			console.error(e)
		} finally {
			await sql.close()
		}
	}

	static GetActivityTickets = async (id) => {
		await sql.connect(dbconnstr)

		try {
			const result = await sql.query(
				`
                    SELECT Act.[ActivityId],
                           Act.[Title]                                    AS "ActivityName",
                           Act.[Description],
                           Act.[ImageName],
                           FORMAT(Act.[EventStart], 'MMM dd yyy - HH:mm') as EventStart,
                           FORMAT(Act.[EventEnd], 'MMM dd yyy - HH:mm')   as EventEnd
                    from [dbo].[Activity] as Act
                    WHERE ACT.[ActivityId] = '${id}'
                    ORDER BY Act.[EventStart] Asc`
			)

			return result.recordsets[0]
		} catch (e) {
			console.error(e)
		} finally {
			await sql.close()
		}
	}
}

class PostService {
}

class PatchService {
}

class DeleteService {
}


export {GetService, PostService, PatchService, DeleteService}