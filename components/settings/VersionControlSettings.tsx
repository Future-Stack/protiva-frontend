"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useGetMeQuery } from "@/lib/features/auth/authApi";
import { useGetVersionConfigQuery, useUpdateVersionConfigMutation } from "@/lib/features/super-admin/version-config/versionConfigAPI";
import { Apple, Save, Loader2, Info, Globe, AlertTriangle, ArrowUpRight, Clock } from "lucide-react";
import Swal from "sweetalert2";

// Custom premium SVG for Android
const AndroidIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M17.5 12c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5m-11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5m11.56-5.7l1.78-3.08a.5.5 0 0 0-.18-.68.5.5 0 0 0-.68.18l-1.81 3.14C15.47 5.31 13.8 5 12 5c-1.8 0-3.47.31-5.17.86L5.02 2.72a.5.5 0 0 0-.68-.18.5.5 0 0 0-.18.68l1.78 3.08C3.12 8.35 1.76 10.96 1.52 14h20.96c-.24-3.04-1.6-5.65-4.42-7.7M12 19c-4.41 0-8-3.59-8-8h16c0 4.41-3.59 8-8 8" />
  </svg>
);

export default function VersionControlSettings() {
  const { data: profileResponse } = useGetMeQuery();
  const reduxUser = useSelector((state: RootState) => state.auth.user);
  const user = profileResponse?.data || reduxUser;
  const isSuperAdmin = user?.role === "SUPER_ADMIN";
  const readOnly = !isSuperAdmin;

  const { data: configResponse, isLoading, refetch } = useGetVersionConfigQuery();
  const [updateVersionConfig, { isLoading: isUpdating }] = useUpdateVersionConfigMutation();

  // Version form states
  const [androidLatestVersion, setAndroidLatestVersion] = useState("");
  const [androidMinRequiredVersion, setAndroidMinRequiredVersion] = useState("");
  const [androidForceUpdate, setAndroidForceUpdate] = useState(false);
  const [androidStoreUrl, setAndroidStoreUrl] = useState("");

  const [iosLatestVersion, setIosLatestVersion] = useState("");
  const [iosMinRequiredVersion, setIosMinRequiredVersion] = useState("");
  const [iosForceUpdate, setIosForceUpdate] = useState(false);
  const [iosStoreUrl, setIosStoreUrl] = useState("");

  // Determine the configuration data from various wrapped formats
  let config: any = null;
  if (configResponse) {
    if (configResponse.data && typeof configResponse.data === "object") {
      if ("androidLatestVersion" in configResponse.data) {
        config = configResponse.data;
      } else if (
        configResponse.data.data &&
        typeof configResponse.data.data === "object" &&
        "androidLatestVersion" in configResponse.data.data
      ) {
        config = configResponse.data.data;
      }
    } else if ("androidLatestVersion" in configResponse) {
      config = configResponse;
    }
  }

  // Bind fetched config to state
  useEffect(() => {
    if (config) {
      setAndroidLatestVersion(config.androidLatestVersion || "");
      setAndroidMinRequiredVersion(config.androidMinRequiredVersion || "");
      setAndroidForceUpdate(!!config.androidForceUpdate);
      setAndroidStoreUrl(config.androidStoreUrl === "string" ? "" : config.androidStoreUrl || "");

      setIosLatestVersion(config.iosLatestVersion || "");
      setIosMinRequiredVersion(config.iosMinRequiredVersion || "");
      setIosForceUpdate(!!config.iosForceUpdate);
      setIosStoreUrl(config.iosStoreUrl === "string" ? "" : config.iosStoreUrl || "");
    }
  }, [config]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (readOnly) return;

    // Simple validation for required fields
    if (!androidLatestVersion || !androidMinRequiredVersion || !androidStoreUrl) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fill out all Android settings.",
      });
      return;
    }

    if (!iosLatestVersion || !iosMinRequiredVersion || !iosStoreUrl) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fill out all iOS settings.",
      });
      return;
    }

    // Regular expression for semantic versioning validation
    const semverRegex = /^\d+\.\d+\.\d+$/;
    if (!semverRegex.test(androidLatestVersion) || !semverRegex.test(androidMinRequiredVersion)) {
      Swal.fire({
        icon: "warning",
        title: "Version Pattern Warning",
        text: "Android versions should follow Semantic Versioning (e.g. 1.0.0). Proceed anyway?",
        showCancelButton: true,
        confirmButtonText: "Yes, save",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await submitUpdate();
        }
      });
      return;
    }

    if (!semverRegex.test(iosLatestVersion) || !semverRegex.test(iosMinRequiredVersion)) {
      Swal.fire({
        icon: "warning",
        title: "Version Pattern Warning",
        text: "iOS versions should follow Semantic Versioning (e.g. 1.0.0). Proceed anyway?",
        showCancelButton: true,
        confirmButtonText: "Yes, save",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await submitUpdate();
        }
      });
      return;
    }

    await submitUpdate();
  };

  const submitUpdate = async () => {
    try {
      const payload = {
        androidLatestVersion,
        androidMinRequiredVersion,
        androidForceUpdate,
        androidStoreUrl,
        iosLatestVersion,
        iosMinRequiredVersion,
        iosForceUpdate,
        iosStoreUrl,
      };

      await updateVersionConfig(payload).unwrap();

      Swal.fire({
        icon: "success",
        title: "Settings Updated!",
        text: "App version configurations have been updated successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
      refetch();
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error?.data?.message || "Failed to update version settings.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-sm text-slate-500 font-medium animate-pulse">Retrieving app version configurations...</p>
      </div>
    );
  }

  // --- Sub-Admin (Read-Only Layout) ---
  if (readOnly) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">App Version Info</h2>
            <p className="text-sm text-slate-500 mt-1">
              Current active versions and store configurations for mobile clients
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Android Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-emerald-600 pointer-events-none">
              <AndroidIcon className="w-24 h-24" />
            </div>

            <div>
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-5">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
                  <AndroidIcon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900">Android Release</h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                  <span className="text-sm text-slate-500">Latest Live Version</span>
                  <span className="text-sm font-semibold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    {androidLatestVersion ? `v${androidLatestVersion}` : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                  <span className="text-sm text-slate-500">Min Required Version</span>
                  <span className="text-sm font-semibold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    {androidMinRequiredVersion ? `v${androidMinRequiredVersion}` : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-sm text-slate-500">Update Policy</span>
                  {androidForceUpdate ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      Force Update
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Optional Update
                    </span>
                  )}
                </div>
              </div>
            </div>

            {androidStoreUrl && (
              <a
                href={androidStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg text-sm transition-all border border-emerald-100"
              >
                <span>Google Play Store</span>
                <ArrowUpRight size={14} />
              </a>
            )}
          </div>

          {/* iOS Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-blue-600 pointer-events-none">
              <Apple className="w-24 h-24" />
            </div>

            <div>
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-5">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Apple className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900">iOS Release</h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                  <span className="text-sm text-slate-500">Latest Live Version</span>
                  <span className="text-sm font-semibold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    {iosLatestVersion ? `v${iosLatestVersion}` : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                  <span className="text-sm text-slate-500">Min Required Version</span>
                  <span className="text-sm font-semibold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    {iosMinRequiredVersion ? `v${iosMinRequiredVersion}` : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-sm text-slate-500">Update Policy</span>
                  {iosForceUpdate ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      Force Update
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      Optional Update
                    </span>
                  )}
                </div>
              </div>
            </div>

            {iosStoreUrl && (
              <a
                href={iosStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg text-sm transition-all border border-blue-100"
              >
                <span>Apple App Store</span>
                <ArrowUpRight size={14} />
              </a>
            )}
          </div>
        </div>

        {/* Footer info showing last updated */}
        {config?.updatedAt && (
          <div className="mt-6 flex items-center gap-2 text-xs text-slate-400 bg-slate-50 p-3 rounded-lg border border-slate-100 w-fit">
            <Clock size={12} />
            <span>Configurations last synchronized: <strong className="text-slate-600 font-semibold">{new Date(config.updatedAt).toLocaleString()}</strong></span>
          </div>
        )}
      </div>
    );
  }

  // --- Super Admin (Edit Form Layout) ---
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl">
      {/* Header section */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Version Control</h2>
        <p className="text-sm text-slate-500 mt-1">
          Configure mobile app versions, manage mandatory upgrades, and update App/Play Store redirection URLs
        </p>
      </div>

      {/* Info and Timestamp metadata banner */}
      {config && (
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mb-6 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/60 w-fit">
          <span className="flex items-center gap-1.5 font-medium text-slate-600 bg-white px-2 py-1 rounded-md border border-slate-100 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Active Config
          </span>
          <span className="text-slate-300">|</span>
          <span className="flex items-center gap-1">
            Last Updated: <strong className="text-slate-700 font-semibold">{new Date(config.updatedAt || config.createdAt).toLocaleString()}</strong>
          </span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Android Configurations Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 relative overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-emerald-200 hover:shadow-md">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-emerald-600 pointer-events-none">
              <AndroidIcon className="w-32 h-32" />
            </div>
            
            <div>
              <div className="flex items-center gap-3 pb-5 border-b border-slate-100 mb-5">
                <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
                  <AndroidIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-950 text-base">Android Settings</h3>
                  <p className="text-xs text-slate-400">Configure parameters for Android App</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Latest App Version</label>
                    <input
                      type="text"
                      required
                      value={androidLatestVersion}
                      onChange={(e) => setAndroidLatestVersion(e.target.value)}
                      placeholder="e.g. 1.0.0"
                      className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-900 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Min Required Version</label>
                    <input
                      type="text"
                      required
                      value={androidMinRequiredVersion}
                      onChange={(e) => setAndroidMinRequiredVersion(e.target.value)}
                      placeholder="e.g. 1.0.0"
                      className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-900 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Google Play Store URL</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                      <Globe size={16} />
                    </div>
                    <input
                      type="url"
                      required
                      value={androidStoreUrl}
                      onChange={(e) => setAndroidStoreUrl(e.target.value)}
                      placeholder="https://play.google.com/store/apps/details?id=..."
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 text-slate-900 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 cursor-pointer select-none" htmlFor="android-force-update">
                      Force Required Update
                    </label>
                    <p className="text-xs text-slate-400 mt-0.5">Prompt users to update if below min version</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      id="android-force-update"
                      type="checkbox"
                      className="sr-only peer"
                      checked={androidForceUpdate}
                      onChange={(e) => setAndroidForceUpdate(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* iOS Configurations Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 relative overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-blue-200 hover:shadow-md">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-blue-600 pointer-events-none">
              <Apple className="w-32 h-32" />
            </div>

            <div>
              <div className="flex items-center gap-3 pb-5 border-b border-slate-100 mb-5">
                <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
                  <Apple className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-950 text-base">iOS Settings</h3>
                  <p className="text-xs text-slate-400">Configure parameters for iOS App</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Latest App Version</label>
                    <input
                      type="text"
                      required
                      value={iosLatestVersion}
                      onChange={(e) => setIosLatestVersion(e.target.value)}
                      placeholder="e.g. 1.0.0"
                      className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-900 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Min Required Version</label>
                    <input
                      type="text"
                      required
                      value={iosMinRequiredVersion}
                      onChange={(e) => setIosMinRequiredVersion(e.target.value)}
                      placeholder="e.g. 1.0.0"
                      className="w-full px-3.5 py-2.5 bg-slate-50 text-slate-900 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Apple App Store URL</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                      <Globe size={16} />
                    </div>
                    <input
                      type="url"
                      required
                      value={iosStoreUrl}
                      onChange={(e) => setIosStoreUrl(e.target.value)}
                      placeholder="https://apps.apple.com/app/id..."
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 text-slate-900 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 cursor-pointer select-none" htmlFor="ios-force-update">
                      Force Required Update
                    </label>
                    <p className="text-xs text-slate-400 mt-0.5">Prompt users to update if below min version</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      id="ios-force-update"
                      type="checkbox"
                      className="sr-only peer"
                      checked={iosForceUpdate}
                      onChange={(e) => setIosForceUpdate(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Informational Alert Box */}
        <div className="flex gap-3.5 p-4 bg-amber-50/60 border border-amber-100 rounded-xl text-slate-600 text-xs leading-relaxed max-w-5xl">
          <AlertTriangle className="text-amber-500 shrink-0 mt-0.5 animate-bounce" size={16} />
          <div>
            <span className="font-semibold text-slate-700">Critical Note on Force Update:</span> Enabling "Force Required Update" locks users out of the mobile application if their installed version is below the specified <strong>Minimum Required Version</strong>. Ensure that the corresponding updates have been fully published to Google Play Store and Apple App Store before increasing the minimum required version parameters.
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isUpdating}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-lg font-bold text-sm shadow-md transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-lg active:scale-95"
          >
            {isUpdating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save size={16} />
            )}
            <span>Save Version Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
