import { Platform } from "react-native";

let configured = false;

export async function signInWithGoogle() {
  if (Platform.OS === "web") {
    throw new Error("Google sign-in is only available in the native app.");
  }

  const { GoogleSignin } = await import(
    "@react-native-google-signin/google-signin"
  );

  if (!configured) {
    const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
    const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

    if (!webClientId) {
      throw new Error(
        "Google sign-in is not configured. Add EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID.",
      );
    }

    GoogleSignin.configure({
      webClientId,
      iosClientId,
      offlineAccess: false,
    });
    configured = true;
  }

  await GoogleSignin.hasPlayServices({
    showPlayServicesUpdateDialog: true,
  });

  const response = await GoogleSignin.signIn();
  const idToken = response.data?.idToken;

  if (!idToken) {
    throw new Error("Google did not return an ID token.");
  }

  return idToken;
}
