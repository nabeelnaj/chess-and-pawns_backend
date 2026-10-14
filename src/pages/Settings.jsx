import { useState } from 'react'
import { cn } from '../lib/utils'

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general')
  const [notifications, setNotifications] = useState({
    emailNewReg: true,
    emailStatusChange: true,
    dailyDigest: false,
    weeklyReport: true,
    slackAlerts: false
  })

  const tabs = [
    { id: 'general', label: 'General', icon: 'settings' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications' },
    { id: 'integrations', label: 'Integrations', icon: 'extension' },
    { id: 'appearance', label: 'Appearance', icon: 'palette' },
    { id: 'security', label: 'Security', icon: 'security' },
    { id: 'advanced', label: 'Advanced', icon: 'tune' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="inline-block w-2 h-2 rounded-full bg-secondary"></span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider">Configuration</span>
            <span>\u2022</span>
            <span className="font-tabular-mono text-primary font-bold">Admin Panel</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Settings</h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">Configure admin panel behavior, notifications, integrations, and security preferences.</p>
        </div>
      </div>

      <div className="flex bg-surface-container-low rounded-xl p-1 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn('flex-1 py-2.5 px-4 rounded-lg font-label-md transition-all flex items-center justify-center gap-2', activeTab === tab.id ? 'bg-white text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface')}
          >
            <span className="material-symbols-outlined text-lg">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="card">
        {activeTab === 'general' && <GeneralSettings />}
        {activeTab === 'notifications' && <NotificationSettings notifications={notifications} setNotifications={setNotifications} />}
        {activeTab === 'integrations' && <IntegrationsSettings />}
        {activeTab === 'appearance' && <AppearanceSettings />}
        {activeTab === 'security' && <SecuritySettings />}
        {activeTab === 'advanced' && <AdvancedSettings />}
      </div>
    </div>
  )
}

function GeneralSettings() {
  const [settings, setSettings] = useState({
    siteName: 'Pockets & Pawns',
    siteTagline: 'Indoor Games & Social Club',
    adminEmail: 'admin@pocketsandpawns.com',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    language: 'en',
    maintenanceMode: false,
    registrationOpen: true,
    autoConfirm: false
  })

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div className="flex items-center gap-2 text-primary">
        <span className="material-symbols-outlined text-lg">settings</span>
        <span className="font-label-sm text-label-sm uppercase tracking-wider">General Configuration</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SettingField label="Site Name" type="text" value={settings.siteName} onChange={e => setSettings({ ...settings, siteName: e.target.value })} />
        <SettingField label="Site Tagline" type="text" value={settings.siteTagline} onChange={e => setSettings({ ...settings, siteTagline: e.target.value })} />
        <SettingField label="Admin Email" type="email" value={settings.adminEmail} onChange={e => setSettings({ ...settings, adminEmail: e.target.value })} />
        <SettingField label="Timezone" type="select" value={settings.timezone} onChange={e => setSettings({ ...settings, timezone: e.target.value })} options={['UTC', 'EST', 'PST', 'CET', 'GMT', 'IST']} />
        <SettingField label="Date Format" type="select" value={settings.dateFormat} onChange={e => setSettings({ ...settings, dateFormat: e.target.value })} options={['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD']} />
        <SettingField label="Default Language" type="select" value={settings.language} onChange={e => setSettings({ ...settings, language: e.target.value })} options={['en', 'es', 'fr', 'de']} />
      </div>

      <div className="space-y-4">
        <h3 className="font-label-lg text-label-lg text-on-surface font-semibold">System Toggles</h3>
        <ToggleSetting label="Maintenance Mode" description="Disable public access to the website (admin panel remains accessible)" value={settings.maintenanceMode} onChange={e => setSettings({ ...settings, maintenanceMode: e.target.checked })} />
        <ToggleSetting label="Registration Open" description="Allow new pre-registrations on the landing page" value={settings.registrationOpen} onChange={e => setSettings({ ...settings, registrationOpen: e.target.checked })} />
        <ToggleSetting label="Auto-Confirm Registrations" description="Automatically set new registrations to 'Confirmed' status" value={settings.autoConfirm} onChange={e => setSettings({ ...settings, autoConfirm: e.target.checked })} />
      </div>

      <div className="pt-4 border-t border-surface-container-high flex justify-end">
        <button className="btn-primary">Save General Settings</button>
      </div>
    </div>
  )
}

function NotificationSettings({ notifications, setNotifications }) {
  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div className="flex items-center gap-2 text-primary">
        <span className="material-symbols-outlined text-lg">notifications</span>
        <span className="font-label-sm text-label-sm uppercase tracking-wider">Notification Preferences</span>
      </div>

      <div className="space-y-4">
        <NotificationToggle label="New Registration Email" description="Receive email when someone submits a pre-registration" value={notifications.emailNewReg} onChange={e => setNotifications({ ...notifications, emailNewReg: e.target.checked })} />
        <NotificationToggle label="Status Change Notifications" description="Get notified when registration status is updated" value={notifications.emailStatusChange} onChange={e => setNotifications({ ...notifications, emailStatusChange: e.target.checked })} />
        <NotificationToggle label="Daily Digest" description="Receive a summary email each morning with registration stats" value={notifications.dailyDigest} onChange={e => setNotifications({ ...notifications, dailyDigest: e.target.checked })} />
        <NotificationToggle label="Weekly Analytics Report" description="Get a comprehensive analytics report every Monday" value={notifications.weeklyReport} onChange={e => setNotifications({ ...notifications, weeklyReport: e.target.checked })} />
        <NotificationToggle label="Slack Alerts" description="Send critical alerts to configured Slack channel" value={notifications.slackAlerts} onChange={e => setNotifications({ ...notifications, slackAlerts: e.target.checked })} />
      </div>

      <div className="pt-4 border-t border-surface-container-high">
        <h3 className="font-label-lg text-label-lg text-on-surface font-semibold mb-4">Notification Channels</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ChannelCard name="Email" configured={true} onConfigure={() => alert('Configure email settings')} />
          <ChannelCard name="Slack" configured={false} onConfigure={() => alert('Configure Slack webhook')} />
          <ChannelCard name="Discord" configured={false} onConfigure={() => alert('Configure Discord webhook')} />
          <ChannelCard name="Webhook" configured={false} onConfigure={() => alert('Configure custom webhook')} />
        </div>
      </div>
    </div>
  )
}

function IntegrationsSettings() {
  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div className="flex items-center gap-2 text-primary">
        <span className="material-symbols-outlined text-lg">extension</span>
        <span className="font-label-sm text-label-sm uppercase tracking-wider">Third-Party Integrations</span>
      </div>

      <div className="space-y-4">
        <IntegrationCard name="Supabase" description="Database, Auth, and Real-time subscriptions" status="connected" onConfigure={() => alert('Open Supabase dashboard')} onDisconnect={() => alert('Disconnect Supabase')} />
        <IntegrationCard name="Vercel" description="Deployment and hosting platform" status="connected" onConfigure={() => alert('Open Vercel dashboard')} onDisconnect={() => alert('Disconnect Vercel')} />
        <IntegrationCard name="Google Analytics" description="Website analytics and tracking" status="disconnected" onConfigure={() => alert('Connect GA4')} onDisconnect={() => {}} />
        <IntegrationCard name="SendGrid" description="Transactional email delivery" status="disconnected" onConfigure={() => alert('Connect SendGrid API')} onDisconnect={() => {}} />
        <IntegrationCard name="Stripe" description="Payment processing for future bookings" status="disconnected" onConfigure={() => alert('Connect Stripe')} onDisconnect={() => {}} />
      </div>
    </div>
  )
}

function AppearanceSettings() {
  const [theme, setTheme] = useState('light')
  const [density, setDensity] = useState('comfortable')

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div className="flex items-center gap-2 text-primary">
        <span className="material-symbols-outlined text-lg">palette</span>
        <span className="font-label-sm text-label-sm uppercase tracking-wider">Appearance</span>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-label-lg text-label-lg text-on-surface font-semibold mb-4">Theme</h3>
          <div className="grid grid-cols-3 gap-4">
            {['light', 'dark', 'system'].map(t => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={cn('p-4 rounded-xl border-2 text-center font-label-md transition-all', theme === t ? 'border-primary bg-primary/5' : 'border-surface-container-high hover:border-primary/50')}
              >
                <span className="material-symbols-outlined text-3xl block mb-2">{t === 'light' ? 'light_mode' : t === 'dark' ? 'dark_mode' : 'computer'}</span>
                <span className="font-medium capitalize">{t}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-label-lg text-label-lg text-on-surface font-semibold mb-4">UI Density</h3>
          <div className="grid grid-cols-3 gap-4">
            {['compact', 'comfortable', 'spacious'].map(d => (
              <button
                key={d}
                onClick={() => setDensity(d)}
                className={cn('p-4 rounded-xl border-2 text-center font-label-md transition-all', density === d ? 'border-primary bg-primary/5' : 'border-surface-container-high hover:border-primary/50')}
              >
                <span className="material-symbols-outlined text-3xl block mb-2">{d === 'compact' ? 'density_small' : d === 'comfortable' ? 'density_medium' : 'density_large'}</span>
                <span className="font-medium capitalize">{d}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-surface-container-high">
          <h3 className="font-label-lg text-label-lg text-on-surface font-semibold mb-4">Custom CSS</h3>
          <textarea className="w-full px-4 py-3 rounded-lg bg-surface-container text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all resize-none font-mono text-sm" rows={8} placeholder="/* Custom CSS variables and overrides */&#10;:root {&#10;  --custom-primary: #your-color;&#10;}" />
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">Advanced: Inject custom CSS variables. Changes apply immediately to admin panel.</p>
        </div>
      </div>
    </div>
  )
}

function SecuritySettings() {
  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div className="flex items-center gap-2 text-primary">
        <span className="material-symbols-outlined text-lg">security</span>
        <span className="font-label-sm text-label-sm uppercase tracking-wider">Security & Access Control</span>
      </div>

      <div className="space-y-6">
        <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high">
          <h3 className="font-label-lg text-label-lg text-on-surface font-semibold mb-4">Two-Factor Authentication</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">Add an extra layer of security to your admin account.</p>
          <div className="flex items-center justify-between">
            <div>
              <span className="font-label-md text-label-md text-on-surface font-semibold">Authenticator App (TOTP)</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Currently <strong>enabled</strong> for your account</p>
            </div>
            <button className="btn-secondary">Manage 2FA</button>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high">
          <h3 className="font-label-lg text-label-lg text-on-surface font-semibold mb-4">Session Management</h3>
          <div className="space-y-3">
            <SessionSetting label="Session Timeout" value="30 minutes" options={['15 min', '30 min', '1 hour', '4 hours', '8 hours']} />
            <SessionSetting label="Max Concurrent Sessions" value="3" options={['1', '2', '3', '5', '10']} />
            <SessionSetting label="Require Re-auth for Sensitive Actions" value="enabled" type="toggle" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high">
          <h3 className="font-label-lg text-label-lg text-on-surface font-semibold mb-4">API Access</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">Manage API keys for programmatic access to registration data.</p>
          <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-high">
            <div>
              <span className="font-label-md text-label-md text-on-surface font-semibold">Admin API Key</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant font-mono text-xs">pk_live_\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded bg-surface-container text-on-surface font-label-sm hover:bg-surface-container-high">Copy</button>
              <button className="px-3 py-1.5 rounded bg-error text-on-error font-label-sm">Regenerate</button>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high">
          <h3 className="font-label-lg text-label-lg text-on-surface font-semibold mb-4">Audit Log</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">Track all admin actions for compliance and debugging.</p>
          <div className="flex items-center justify-between">
            <div>
              <span className="font-label-md text-label-md text-on-surface font-semibold">Audit Logging</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Currently <strong>enabled</strong> - all actions logged</p>
            </div>
            <button className="btn-secondary">View Audit Log</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function AdvancedSettings() {
  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div className="flex items-center gap-2 text-primary">
        <span className="material-symbols-outlined text-lg">tune</span>
        <span className="font-label-sm text-label-sm uppercase tracking-wider">Advanced Configuration</span>
      </div>

      <div className="p-4 rounded-xl bg-error/10 border border-error/30">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-error text-xl flex-shrink-0 mt-0.5">warning</span>
          <div>
            <span className="font-label-md text-label-md text-error font-bold">Advanced Settings Warning</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Modifying these settings can affect system stability and data integrity. Only change these if you understand the implications.</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high">
          <h3 className="font-label-lg text-label-lg text-on-surface font-semibold mb-4">Database Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SettingField label="Connection Pool Size" type="number" value="20" />
            <SettingField label="Query Timeout (ms)" type="number" value="30000" />
            <SettingField label="Enable Query Logging" type="select" value="false" options={['true', 'false']} />
            <SettingField label="Auto Vacuum" type="select" value="true" options={['true', 'false']} />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high">
          <h3 className="font-label-lg text-label-lg text-on-surface font-semibold mb-4">Real-time Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SettingField label="Max Concurrent Subscriptions" type="number" value="100" />
            <SettingField label="Presence Timeout (ms)" type="number" value="30000" />
            <SettingField label="Broadcast Buffer Size" type="number" value="1000" />
            <SettingField label="Enable Debug Logging" type="select" value="false" options={['true', 'false']} />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high">
          <h3 className="font-label-lg text-label-lg text-on-surface font-semibold mb-4">Feature Flags</h3>
          <div className="space-y-3">
            <ToggleSetting label="Enable Recurring Bookings" description="Allow users to create recurring weekly/monthly bookings" value={true} onChange={() => {}} />
            <ToggleSetting label="Enable Waitlist" description="Allow users to join waitlist for fully booked slots" value={false} onChange={() => {}} />
            <ToggleSetting label="Enable Group Booking Discounts" description="Apply automatic discounts for groups of 4+" value={false} onChange={() => {}} />
            <ToggleSetting label="Enable Multi-language Support" description="Allow content translation for international visitors" value={false} onChange={() => {}} />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high">
          <h3 className="font-label-lg text-label-lg text-on-surface font-semibold mb-4">Danger Zone</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-error/10 border border-error/30">
              <div>
                <span className="font-label-md text-label-md text-error font-semibold">Clear All Registrations</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Permanently delete all registration data. This action cannot be undone.</p>
              </div>
              <button className="px-4 py-2 rounded-lg bg-error text-on-error font-label-md hover:bg-error/90">Clear All Data</button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-error/10 border border-error/30">
              <div>
                <span className="font-label-md text-label-md text-error font-semibold">Reset Admin Panel</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Reset all settings to defaults. User accounts and registrations will be preserved.</p>
              </div>
              <button className="px-4 py-2 rounded-lg bg-error text-on-error font-label-md hover:bg-error/90">Reset Settings</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SettingField({ label, type, value, onChange, options }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-label-md text-label-md text-on-surface font-semibold">{label}</label>
      {type === 'select' ? (
        <select value={value} onChange={onChange} className="px-4 py-2 rounded-lg bg-surface-container text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary">
          {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : (
        <input type={type} value={value} onChange={onChange} className="px-4 py-2 rounded-lg bg-surface-container text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary" />
      )}
    </div>
  )
}

function ToggleSetting({ label, description, value, onChange }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low border border-surface-container-high">
      <div>
        <span className="font-label-md text-label-md text-on-surface font-semibold">{label}</span>
        <p className="font-body-sm text-body-sm text-on-surface-variant">{description}</p>
      </div>
      <input type="checkbox" checked={value} onChange={onChange} className="w-5 h-5 rounded text-secondary focus:ring-primary cursor-pointer" />
    </div>
  )
}

function NotificationToggle({ label, description, value, onChange }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low border border-surface-container-high">
      <div>
        <span className="font-label-md text-label-md text-on-surface font-semibold">{label}</span>
        <p className="font-body-sm text-body-sm text-on-surface-variant">{description}</p>
      </div>
      <input type="checkbox" checked={value} onChange={onChange} className="w-5 h-5 rounded text-secondary focus:ring-primary cursor-pointer" />
    </div>
  )
}

function ChannelCard({ name, configured, onConfigure }) {
  return (
    <div className="p-4 rounded-lg bg-surface-container-low border border-surface-container-high">
      <div className="flex items-center justify-between mb-3">
        <span className="font-label-md text-label-md text-on-surface font-semibold">{name}</span>
        <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded font-label-sm font-semibold', configured ? 'bg-secondary text-on-secondary' : 'bg-surface-container-high text-on-surface-variant')}>
          {configured ? <span className="material-symbols-outlined text-xs">check_circle</span> : <span className="material-symbols-outlined text-xs">radio_button_unchecked</span>}
          {configured ? 'Connected' : 'Not Connected'}
        </span>
      </div>
      <button onClick={onConfigure} className={cn('w-full px-3 py-2 rounded-lg font-label-sm font-semibold transition-colors', configured ? 'bg-surface-container text-on-surface hover:bg-surface-container-high' : 'bg-secondary text-on-secondary hover:opacity-90')}>
        {configured ? 'Manage' : 'Configure'}
      </button>
    </div>
  )
}

function IntegrationCard({ name, description, status, onConfigure, onDisconnect }) {
  return (
    <div className="p-4 rounded-lg bg-surface-container-low border border-surface-container-high">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <span className="font-label-md text-label-md text-on-surface font-semibold">{name}</span>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{description}</p>
        </div>
        <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded font-label-sm font-semibold shrink-0', status === 'connected' ? 'bg-secondary text-on-secondary' : 'bg-surface-container-high text-on-surface-variant')}>
          <span className="material-symbols-outlined text-xs">{status === 'connected' ? 'link' : 'link_off'}</span>
          {status === 'connected' ? 'Connected' : 'Disconnected'}
        </span>
      </div>
      <div className="flex items-center gap-2 mt-3">
        <button onClick={onConfigure} className="flex-1 px-3 py-2 rounded-lg font-label-sm font-semibold transition-colors bg-secondary text-on-secondary hover:opacity-90">Configure</button>
        {status === 'connected' && <button onClick={onDisconnect} className="px-3 py-2 rounded-lg font-label-sm font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high">Disconnect</button>}
      </div>
    </div>
  )
}

function SessionSetting({ label, value, options, type }) {
  if (type === 'toggle') {
    return <ToggleSetting label={label} description="" value={value === 'enabled'} onChange={() => {}} />
  }
  return (
    <div className="flex flex-col gap-1">
      <label className="font-label-md text-label-md text-on-surface font-semibold">{label}</label>
      <select value={value} className="px-4 py-2 rounded-lg bg-surface-container text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary">
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  )
}