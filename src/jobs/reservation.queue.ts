import { Queue } from "bullmq";

const connection = {
  host: "localhost",
  port: 6380,
};

export const expirationQueue = new Queue("reservation-expiration", {
  connection,
});

export const addExpirationJob = async (
  reservationId: string,
  seatId: string,
  delayInMs: number,
) => {
  await expirationQueue.add(
    "expire-job",
    { reservationId, seatId },
    { delay: delayInMs },
  );

  console.log(
    `⏱️ [Queue] Job pembatalan ditambahkan untuk reservasi ${reservationId}. Menunggu ${delayInMs / 1000} detik...`,
  );
};
