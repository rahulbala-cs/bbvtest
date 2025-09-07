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

# Gson serialized fields (if used)
-keepclassmembers class ** {
    @com.google.gson.annotations.SerializedName <fields>;
}
