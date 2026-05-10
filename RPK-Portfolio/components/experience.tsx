export function Experience() {
  const experiences = [
    {
      title: 'Associate Professor',
      organization: 'Chaitanya Deemed to be University',
      period: 'Apr 2024 - Present',
      location: 'Gandipet, Himayathnagar, Ranga Reddy, Telangana',
      duties: ['Teaching', 'Research', 'Student Mentoring', 'Course Development'],
    },
    {
      title: 'Assistant Professor',
      organization: 'Nalla Malla Reddy Engineering College',
      period: 'Oct 2022 - Mar 2024',
      location: 'Hyderabad, Telangana',
      duties: ['Teaching', 'Handling Final Year Projects', 'Course Coordination', 'Student Evaluation'],
    },
    {
      title: 'Young Professional (YP-II)',
      organization: 'CRIDA, AICRPAM - NICRA',
      period: 'Mar 2022 - Oct 2022',
      location: 'Santoshnagar, Hyderabad, Telangana',
      duties: ['Climate Data Analysis', 'GCM Downscaling', 'Bias Correction', 'MATLAB to R Conversion', 'Data Visualization'],
    },
    {
      title: 'Highly Skilled Research Professional (Contract)',
      organization: 'CRIDA, AICRPAM',
      period: 'Sep 2020 - Mar 2022',
      location: 'Santoshnagar, Hyderabad, Telangana',
      duties: ['Research Project Execution', 'Data Analysis', 'Climate Modeling', 'Scientific Writing'],
    },
    {
      title: 'Teaching Associate',
      organization: 'Institute of Agricultural Engineering and Technology',
      period: 'Jan 2020 - Jul 2020',
      location: 'PJTSAU, Rajendranagar, Hyderabad',
      duties: ['Teaching', 'Curriculum Support', 'Student Guidance'],
    },
  ]

  return (
    <section id="experience" className="py-16 md:py-24 border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-foreground mb-3">Work Experience</h2>
        <p className="text-muted-foreground mb-12">5+ Years of Academic and Research Experience</p>
        <div className="space-y-6">
          {experiences.map((exp, idx) => (
            <div key={idx} className="bg-card border border-border rounded-lg p-6 hover:border-accent/50 transition-colors hover-lift">
              <div className="flex justify-between items-start gap-4 mb-3">
                <div>
                  <h3 className="text-xl font-bold text-foreground">{exp.title}</h3>
                  <p className="text-accent font-medium">{exp.organization}</p>
                </div>
                <span className="text-sm text-muted-foreground whitespace-nowrap bg-muted px-3 py-1 rounded">{exp.period}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{exp.location}</p>
              <div className="flex flex-wrap gap-2">
                {exp.duties.map((duty, idx) => (
                  <span key={idx} className="bg-primary/10 text-accent text-xs px-3 py-1.5 rounded-full font-medium border border-primary/20 hover:border-primary/50 transition-colors">
                    {duty}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
