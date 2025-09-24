# React Native & Hermes
-keep class com.facebook.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }

# Reanimated & Gesture Handler
-keep class com.swmansion.reanimated.** { *; }
-keep class com.swmansion.gesturehandler.** { *; }

# WebView & Vector Icons
-keep class com.reactnativecommunity.webview.** { *; }
-keep class com.oblador.vectoricons.** { *; }

# Firebase & Google Play Services
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
-keep class com.google.android.gms.ads.** { *; }

# React Native Firebase (io.invertase)
# Keep all RNFirebase classes and prevent obfuscation/removal so auto-init works
-keep class io.invertase.firebase.** { *; }
-keep class io.invertase.** { *; }

# Keep Firebase Init Provider and registrars
-keep class com.google.firebase.provider.FirebaseInitProvider { *; }
-keep class com.google.firebase.components.ComponentRegistrar { *; }
## Keep any ComponentRegistrar implementations (required for Firebase auto-init)
-keep class * implements com.google.firebase.components.ComponentRegistrar { *; }
## Keep core component classes
-keep class com.google.firebase.components.Component { *; }
-keep class com.google.firebase.components.Dependency { *; }
## RNFirebase specific registrar
-keep class io.invertase.firebase.app.ReactNativeFirebaseAppRegistrar { *; }

# Gson serialized fields (if used)
-keepclassmembers class ** {
    @com.google.gson.annotations.SerializedName <fields>;
}
 
# Keep Firebase Messaging service if present
-keep class **.MessagingService { *; }

# Keep React Navigation/other reflection-heavy packages (safe keep)
-keep class com.swmansion.** { *; }
-keep class androidx.navigation.** { *; }
