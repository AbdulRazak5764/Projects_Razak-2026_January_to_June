export function Education() {
  const education = [
    {
      degree: 'Ph.D.',
      field: 'Computational Nanoscience and Technology',
      institution: 'Central University of Jharkhand',
      location: 'Ranchi, Jharkhand',
      year: 'Completed',
      thesis: 'Computational Study of Sputter Thin Films and Nano indentation',
      cgpa: 'CGPA: 7.25',
    },
    {
      degree: 'M.Tech',
      field: 'Nanotechnology',
      institution: 'ASTRA/JNTUH - IST',
      location: 'Hyderabad',
      year: '2012',
      achievement: 'Through GATE Fellowship',
      percentage: '72.06%',
    },
    {
      degree: 'B.Tech',
      field: 'Computer Science and Engineering',
      institution: 'MTEC/JNTUH',
      location: 'Karimnagar',
      year: '2011',
      percentage: '60.88%',
    },
    {
      degree: 'Intermediate (10+2)',
      field: 'M.Bi.P.C',
      institution: 'Jawahar Navodaya Vidyalaya',
      location: 'Adilabad, Telangana',
      year: '2009',
      percentage: '63.00%',
    },
  ]

  return (
    <section id="education" className="py-16 md:py-24 border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-foreground mb-12">Education</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {education.map((edu, idx) => (
            <div key={idx} className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-foreground">{edu.degree}</h3>
                  <p className="text-accent text-sm">{edu.field}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{edu.year}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{edu.institution}</p>
              <p className="text-xs text-muted-foreground mb-3">{edu.location}</p>
              {edu.thesis && (
                <p className="text-xs text-primary mb-2"><strong>Thesis:</strong> {edu.thesis}</p>
              )}
              {edu.cgpa && <p className="text-xs text-accent">{edu.cgpa}</p>}
              {edu.percentage && <p className="text-xs text-accent">{edu.percentage}</p>}
              {edu.achievement && <p className="text-xs text-primary">{edu.achievement}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
