import db from '../dbConnection';

interface LogPayload {

  user_id: number;

  business_id: number;

  module: string;

  action: string;

  description: string;

}

const logActivity = async ({
  user_id,
  business_id,
  module,
  action,
  description
}: LogPayload) => {

  try {

    await db.query(

      `
        INSERT INTO activity_logs
        (
          user_id,
          business_id,
          module,
          action,
          description
        )
        VALUES (?, ?, ?, ?, ?)
      `,

      [
        user_id,
        business_id,
        module,
        action,
        description
      ]

    );

  } catch (error) {

    console.error(
      'Failed to create activity log:',
      error
    );

  }

};

export default logActivity;