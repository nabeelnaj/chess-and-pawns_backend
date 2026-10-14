import { useState } from 'react'
import { cn } from '../lib/utils'

const sections = [
  { id: 'hero', title: 'Hero Section', fields: ['Headline', 'Subheadline', 'CTA Text', 'CTA Link', 'Background Image', 'Metrics (4 items)'] },
  { id: 'about', title: 'About / Philosophy', fields: ['Section Title', 'Section Subtitle', 'Body Text', 'Pillar 1 (Icon, Title, Description)', 'Pillar 2 (Icon, Title, Description)', 'Pillar 3 (Icon, Title, Description)'] },
  { id: 'games', title: 'Games & Activities', fields: ['Section Title', 'Section Subtitle', 'Filter Categories', 'Game Cards (6 items with image, title, description, badge, CTA)'] },
  { id: 'why-us', title: 'Why Choose Us', fields: ['Section Title', 'Section Subtitle', 'Feature Cards (6 items with icon, title, description)'] },
  { id: 'experience', title: 'Experience & Facilities', fields: ['Section Title', 'Section Subtitle', 'Main Image', 'Secondary Images (2)', 'Venue Vision Notice'] },
  { id: 'how-it-works', title: 'How It Works', fields: ['Section Title', 'Section Subtitle', 'Step 1 (Number, Title, Description)', 'Step 2 (Number, Title, Description)', 'Step 3 (Number, Title, Description)', 'Disclaimer Text'] },
  { id: 'register', title: 'Pre-Registration Form', fields: ['Section Title', 'Section Subtitle', 'Form Fields Configuration', 'Game Options (multi-select)', 'Visit Type Options (radio)', 'Party Size Options', 'Consent Text', 'Success Message'] },
  { id: 'faq', title: 'FAQ', fields: ['Section Title', 'Section Subtitle', 'FAQ Items (8 accordions with question/answer)'] },
  { id: 'contact', title: 'Contact & Social', fields: ['Section Title', 'Section Subtitle', 'Description', 'Social Links (Instagram, Facebook)', 'Contact Info (Email, Phone, Location)', 'Demo Notice'] },
  { id: 'footer', title: 'Footer', fields: ['Copyright Text', 'Social Links', 'Legal Links'] }
]

export default function WebsiteContent() {
  const [activeSection, setActiveSection] = useState(sections[0].id)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({})

  const section = sections.find(s => s.id === activeSection)

  const handleSave = () => {
    setEditing(false)
    alert('Content saved successfully!')
  }

  const handleCancel = () => {
    setFormData({})
    setEditing(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="inline-block w-2 h-2 rounded-full bg-secondary"></span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider">Content Management</span>
            <span>\u2022</span>
            <span className="font-tabular-mono text-primary font-bold">Live Website</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Website Content CMS</h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">Manage all copy, images, and configuration for the public Pockets & Pawns landing page.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setEditing(!editing)} className={cn('inline-flex items-center gap-2 px-4 py-2 rounded-lg font-label-md text-label-md transition-all', editing ? 'bg-error text-on-error hover:bg-error/90' : 'bg-secondary text-on-secondary hover:opacity-90')}>
            <span className="material-symbols-outlined text-base">{editing ? 'save' : 'edit'}</span>
            <span>{editing ? 'Save Changes' : 'Edit Content'}</span>
          </button>
          <a href="/" target="_blank" className="flex items-center gap-2 px-3 py-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md">
            <span className="material-symbols-outlined text-lg">open_in_new</span>
            <span>View Live</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3">
          <div className="card p-4 h-full">
            <div className="flex items-center justify-between mb-4">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Page Sections</span>
              <span className="font-tabular-mono text-label-sm text-on-surface-variant">{sections.length} sections</span>
            </div>
            <nav className="flex flex-col gap-1">
              {sections.map(s => (
                <button
                  key={s.id}
                  onClick={() => { setActiveSection(s.id); setFormData({}); setEditing(false); }}
                  className={cn('w-full text-left px-3 py-2.5 rounded-lg font-label-md transition-all', activeSection === s.id ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface')}
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">
                      {s.id === 'hero' ? 'dashboard' : s.id === 'about' ? 'info' : s.id === 'games' ? 'sports_esports' : s.id === 'why-us' ? 'star' : s.id === 'experience' ? 'photo_library' : s.id === 'how-it-works' ? 'timeline' : s.id === 'register' ? 'how_to_reg' : s.id === 'faq' ? 'help' : s.id === 'contact' ? 'mail' : 'footer'}
                    </span>
                    <span className="truncate">{s.title}</span>
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="lg:col-span-9">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider">{section?.id.toUpperCase()}</span>
                <h2 className="font-headline-md text-headline-md text-on-surface mt-1">{section?.title}</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-semibold">{section?.fields.length || 0} fields</span>
                <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded font-label-sm font-semibold', editing ? 'bg-secondary text-on-secondary' : 'bg-secondary-container text-on-secondary-container')}>
                  {editing ? <span className="material-symbols-outlined text-sm">edit</span> : <span className="material-symbols-outlined text-sm">visibility</span>}
                  {editing ? 'Editing' : 'Preview'}
                </span>
              </div>
            </div>

            {editing ? (
              <EditorForm section={section} formData={formData} setFormData={setFormData} onSave={handleSave} onCancel={handleCancel} />
            ) : (
              <PreviewPanel section={section} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function EditorForm({ section, formData, setFormData, onSave, onCancel }) {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-lg bg-primary-fixed/20 text-on-primary-fixed-variant flex items-start gap-3">
        <span className="material-symbols-outlined text-primary text-xl flex-shrink-0 mt-0.5">edit</span>
        <div>
          <span className="font-label-md text-label-md font-bold text-on-surface">Editing Mode Active</span>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Changes will be reflected on the live website after saving. All fields support Markdown formatting.</p>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onSave(); }} className="space-y-5">
        {section.fields.map((field, index) => (
          <div key={field} className="flex flex-col gap-1">
            <label className="font-label-md text-label-md text-on-surface font-semibold">{field} <span className="text-error">*</span></label>
            <textarea
              value={formData[field] || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg bg-surface-container text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all resize-none"
              placeholder={`Enter ${field}...`}
              rows={field.toLowerCase().includes('description') || field.toLowerCase().includes('body') ? 4 : 2}
            />
          </div>
        ))}
        <div className="flex justify-end gap-3 pt-4 border-t border-surface-container-high">
          <button type="button" onClick={onCancel} className="px-5 py-2 rounded-lg font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors">Cancel</button>
          <button type="submit" className="flex items-center gap-2 bg-secondary hover:bg-on-secondary-fixed-variant text-on-secondary px-6 py-2 rounded-lg font-label-md text-label-md shadow-md hover:shadow-lg transition-all"><span className="material-symbols-outlined text-lg">save</span><span>Save Changes</span></button>
        </div>
      </form>
    </div>
  )
}

function PreviewPanel({ section }) {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-lg bg-surface-container-low text-on-surface-variant flex items-start gap-3">
        <span className="material-symbols-outlined text-primary text-xl flex-shrink-0 mt-0.5">visibility</span>
        <div>
          <span className="font-label-md text-label-md font-bold text-on-surface">Preview Mode</span>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Click "Edit Content" to modify fields. This preview shows how content will appear on the live site.</p>
        </div>
      </div>

      <div className="space-y-4">
        {section.fields.map((field, index) => (
          <div key={field} className="p-4 rounded-lg bg-surface-container-low border border-surface-container-high">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-mono">{index + 1}</span>
              <span className="font-label-md text-label-md text-on-surface font-semibold">{field}</span>
            </div>
            <div className="font-body-md text-body-md text-on-surface-variant italic text-sm">
              [Content for "{field}" will appear here on the live site]
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function handleSave() {
  setEditing(false)
  alert('Content saved successfully!')
}

function handleCancel() {
  setFormData({})
  setEditing(false)
}