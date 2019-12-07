//Register Service Worker
if (!("serviceWorker" in navigator)) {
  console.log("ServiceWorker is not supported in this browser.");
} else {
  registerServiceWorker();
  requestPermission();
}

function registerServiceWorker() {
  return navigator.serviceWorker
    .register("./service-worker.js")
    .then(function(registration) {
      console.log("ServiceWorker successfully registered.");
      return registration;
    })
    .catch(function(err) {
      console.log("ServiceWorker registration failed: ", err);
    });
}

document.addEventListener("DOMContentLoaded", function() {
  getStanding();
});

function requestPermission() {
  if ("Notification" in window) {
    Notification.requestPermission().then(function(result) {
      if (result === "denied") {
        console.log("Notification request denied.");
        return;
      } else if (result === "default") {
        console.log("Notification request ignored");
        return;
      }

      if ("PushManager" in window) {
        navigator.serviceWorker.getRegistration().then(function(registration) {
          registration.pushManager
            .subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(
                "BFjzF1Fa23lJ8jWUBvXBNBE6JZCfWgwQp63UAzg9EBDdJf5tjW2ucCqTZJFUddpIeczw7kPd-ROC6XQzq7SY-cg"
              )
            })
            .then(function(subscribe) {
              console.log(
                "Subscirbed successfully with endpoint: ",
                subscribe.endpoint
              );
              console.log(
                "Subscribed successfully with p256dh key: ",
                btoa(
                  String.fromCharCode.apply(
                    null,
                    new Uint8Array(subscribe.getKey("p256dh"))
                  )
                )
              );
              console.log(
                "Subscirbed successfully with auth key: ",
                btoa(
                  String.fromCharCode.apply(
                    null,
                    new Uint8Array(subscribe.getKey("auth"))
                  )
                )
              );
            })
            .catch(function(e) {
              console.error("Subscribe failed: ", e.message);
            });
        });
      }
    });
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
