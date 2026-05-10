export function Certifications() {
  const certifications = [
    {
      title: 'Elite NPTEL Certification - R Programming',
      issuer: 'IIT Kanpur',
      year: '2020',
      description: 'Advanced R programming course',
    },
    {
      title: 'Elite NPTEL Certification - Machine Learning For Soil And Crop Management',
      issuer: 'IIT Kharagpur',
      year: '2022',
      description: 'ML applications in agriculture',
    },
    {
      title: 'IUCEE International Engineering Educator Certification Program',
      issuer: 'IUCEE, IGIP',
      year: 'Fall 2023',
      duration: '6 months',
      description: 'Global engineering education standards',
    },
    {
      title: 'FDP Participation Certificate - Data Analytics Using Power BI',
      issuer: 'ExcelR',
      year: '2025',
      description: 'Data visualization and analytics',
    },
  ]

  return (
    <section id="certifications" className="py-16 md:py-24 border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-foreground mb-12">Certifications & Training</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {certifications.map((cert, idx) => (
            <div key={idx} className="bg-card border border-border rounded-lg p-6 hover:border-accent/50 transition-colors hover-lift">
              <h3 className="text-lg font-bold text-foreground mb-2">{cert.title}</h3>
              <p className="text-sm text-accent mb-2 font-medium">{cert.issuer}</p>
              {cert.duration && (
                <p className="text-xs text-muted-foreground mb-2">Duration: {cert.duration}</p>
              )}
              <p className="text-xs text-muted-foreground mb-3">Year: {cert.year}</p>
              {cert.description && (
                <p className="text-xs text-muted-foreground italic">{cert.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
