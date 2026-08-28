"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, Lock, MapPin, Bell, Save, Eye, EyeOff, Shield } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuthStore } from "@/store/useAuthStore";
import { api } from "@/lib/api";

interface ProfileForm {
  full_name: string;
  email: string;
  phone: string;
}

interface PasswordForm {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

interface NotificationPrefs {
  order_updates: boolean;
  promotions: boolean;
  review_replies: boolean;
  price_alerts: boolean;
  newsletter: boolean;
}

export default function AccountPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications">("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  const [profile, setProfile] = useState<ProfileForm>({
    full_name: user?.full_name || "",
    email: user?.email || "",
    phone: "",
  });

  const [passwords, setPasswords] = useState<PasswordForm>({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [notifPrefs, setNotifPrefs] = useState<NotificationPrefs>({
    order_updates: true,
    promotions: false,
    review_replies: true,
    price_alerts: true,
    newsletter: false,
  });

  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        full_name: user.full_name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  async function handleSaveProfile() {
    setIsSaving(true);
    try {
      await api.put("/users/me", profile);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleChangePassword() {
    if (passwords.new_password !== passwords.confirm_password) {
      alert("Passwords do not match");
      return;
    }
    setIsSaving(true);
    try {
      await api.post("/users/me/change-password", {
        current_password: passwords.current_password,
        new_password: passwords.new_password,
      });
      setPasswords({ current_password: "", new_password: "", confirm_password: "" });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  }

  const tabs = [
    { key: "profile" as const, label: "Profile", icon: User },
    { key: "security" as const, label: "Security", icon: Shield },
    { key: "notifications" as const, label: "Notifications", icon: Bell },
  ];

  const notifOptions = [
    { key: "order_updates" as const, label: "Order Status Updates", desc: "Get notified when your order ships or is delivered" },
    { key: "promotions" as const, label: "Promotional Offers", desc: "Receive deals, flash sales, and exclusive discounts" },
    { key: "review_replies" as const, label: "Vendor Review Replies", desc: "Know when a seller responds to your review" },
    { key: "price_alerts" as const, label: "Price Drop Alerts", desc: "Get alerted when wishlist items go on sale" },
    { key: "newsletter" as const, label: "Weekly Newsletter", desc: "Curated product picks and marketplace news" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Account Settings</h1>
          <p className="text-xs text-gray-500 mt-1">Manage your profile, security, and notification preferences.</p>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? "bg-brand-600 text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "profile" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-gray-900">Personal Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={profile.full_name}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" /> {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}

        {activeTab === "security" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-gray-900">Change Password</h2>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showCurrentPw ? "text" : "password"}
                    value={passwords.current_password}
                    onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPw(!showCurrentPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showNewPw ? "text" : "password"}
                    value={passwords.new_password}
                    onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPw(!showNewPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    value={passwords.confirm_password}
                    onChange={(e) => setPasswords({ ...passwords, confirm_password: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={handleChangePassword}
              disabled={isSaving}
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <Lock className="w-3.5 h-3.5" /> {isSaving ? "Updating..." : "Update Password"}
            </button>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-gray-900">Notification Preferences</h2>
            <div className="space-y-4">
              {notifOptions.map((opt) => (
                <div
                  key={opt.key}
                  className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:bg-slate-50/50 transition-colors"
                >
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">{opt.label}</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">{opt.desc}</p>
                  </div>
                  <button
                    onClick={() =>
                      setNotifPrefs((prev) => ({ ...prev, [opt.key]: !prev[opt.key] }))
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifPrefs[opt.key] ? "bg-brand-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                        notifPrefs[opt.key] ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
