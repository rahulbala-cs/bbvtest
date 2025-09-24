package com.biggboss.teluguvote;

import android.app.Application;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;
import java.util.List;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new DefaultReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }

        @Override
        protected boolean isNewArchEnabled() {
          return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
        }

        @Override
        protected Boolean isHermesEnabled() {
          return BuildConfig.IS_HERMES_ENABLED;
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    // Ensure default Firebase app exists before JS modules attempt access
    try {
      FirebaseApp.initializeApp(this);
      if (FirebaseApp.getApps(this).isEmpty()) {
        // Fallback: build options manually from resources or hardcoded safe defaults
        String appId;
        String apiKey;
        String projectId;
        String gcmSenderId;
        String storageBucket;
        try {
          int idApp = getResources().getIdentifier("google_app_id", "string", getPackageName());
          int idKey = getResources().getIdentifier("google_api_key", "string", getPackageName());
          int idProj = getResources().getIdentifier("project_id", "string", getPackageName());
          int idGcm = getResources().getIdentifier("gcm_defaultSenderId", "string", getPackageName());
          int idBucket = getResources().getIdentifier("google_storage_bucket", "string", getPackageName());
          appId = idApp != 0 ? getString(idApp) : "1:721871577189:android:4c4884207e2d4dfbd6a68c";
          apiKey = idKey != 0 ? getString(idKey) : "AIzaSyDJXZti_sPo7fKDr07uQaTQDQZHbFxJWHg";
          projectId = idProj != 0 ? getString(idProj) : "bigg-boss-telugu-vote";
          gcmSenderId = idGcm != 0 ? getString(idGcm) : "721871577189";
          storageBucket = idBucket != 0 ? getString(idBucket) : "bigg-boss-telugu-vote.firebasestorage.app";
        } catch (Exception e) {
          appId = "1:721871577189:android:4c4884207e2d4dfbd6a68c";
          apiKey = "AIzaSyDJXZti_sPo7fKDr07uQaTQDQZHbFxJWHg";
          projectId = "bigg-boss-telugu-vote";
          gcmSenderId = "721871577189";
          storageBucket = "bigg-boss-telugu-vote.firebasestorage.app";
        }

        FirebaseOptions options = new FirebaseOptions.Builder()
          .setApplicationId(appId)
          .setApiKey(apiKey)
          .setProjectId(projectId)
          .setGcmSenderId(gcmSenderId)
          .setStorageBucket(storageBucket)
          .build();
        FirebaseApp.initializeApp(this, options);
      }
    } catch (Exception ignored) {}
    SoLoader.init(this, /* native exopackage */ false);
    // Reanimated: ensure class is available at startup (no-op guard)
    try {
      Class.forName("com.swmansion.reanimated.ReanimatedJSIModulePackage");
    } catch (ClassNotFoundException ignored) {}
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      DefaultNewArchitectureEntryPoint.load();
    }
  }
}