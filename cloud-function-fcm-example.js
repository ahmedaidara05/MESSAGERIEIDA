/**
 * Exemple Cloud Function (Firebase Functions v2) :
 * lit la collection Firestore "push_queue" et envoie via FCM.
 *
 * Déploiement (après firebase init functions) :
 *   firebase deploy --only functions
 *
 * Dans index.js de tes functions :
 */
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getMessaging } = require("firebase-admin/messaging");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp();

exports.sendPushFromQueue = onDocumentCreated("push_queue/{id}", async (event) => {
  const data = event.data && event.data.data();
  if (!data || !data.fcmToken) return;

  try {
    await getMessaging().send({
      token: data.fcmToken,
      notification: {
        title: data.title || "Message",
        body: data.body || ""
      },
      data: {
        url: data.url || "/"
      },
      webpush: {
        fcmOptions: { link: data.url || "/" }
      }
    });
    await event.data.ref.update({ sent: true, sentAt: new Date() });
  } catch (e) {
    console.error("FCM error", e);
    await event.data.ref.update({ error: String(e.message || e) });
  }
});
