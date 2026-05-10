export function Projects() {
  const projects = [
    {
      title: 'Dynamic Placement Assistance Portal',
      year: '2022-23',
      degree: 'B.Tech',
      members: [
        { name: 'V. Manikanta Ajay', rollNo: '19B61A05G1' },
        { name: 'Palle Sathyaraj', rollNo: '19B61A05B7' },
        { name: 'Sravani Marri', rollNo: '19B61A05E6' },
        { name: 'Perugu Srividya', rollNo: '19B61A05C2' },
      ],
    },
    {
      title: 'Voronoing Location Specific Data',
      year: '2022-24',
      degree: 'B.Tech',
      members: [
        { name: 'B. Pradeep', rollNo: '19B61A0513' },
        { name: 'B. Kalyan', rollNo: '19B61A0514' },
        { name: 'Ch. Samanth', rollNo: '19B61A0531' },
        { name: 'A. Sumanth', rollNo: '19B61A0507' },
      ],
    },
    {
      title: 'IOT Based Smart Agriculture System and Machine Learning',
      year: '2024-25',
      degree: 'M.Tech',
      members: [
        { name: 'M. Christhu Raju', rollNo: '2024-25' },
      ],
    },
    {
      title: 'IOT-based Smart Irrigation System using Machine Learning Techniques',
      year: '2024-25',
      degree: 'M.Tech',
      members: [
        { name: 'C. Srisailam', rollNo: '23MCE1002/223211002' },
      ],
    },
    {
      title: 'Smart India Hackathon – 2024 (Software Edition)',
      year: '2024',
      degree: 'Hackathon',
      members: [
        { name: 'Final Round - Finalist Team', rollNo: 'Competition' },
      ],
    },
  ]

  return (
    <section id="projects" className="py-16 md:py-24 border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-foreground mb-12">Projects Mentored/Guided</h2>
        <div className="space-y-4">
          {projects.map((project, idx) => (
            <div key={idx} className="bg-card border border-border rounded-lg p-6 hover:border-accent/50 transition-colors">
              <div className="flex justify-between items-start gap-4 mb-3">
                <div>
                  <h3 className="text-lg font-bold text-foreground">{project.title}</h3>
                  <span className="inline-block bg-primary text-primary-foreground text-xs px-3 py-1 rounded mt-2 font-medium">
                    {project.degree}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground whitespace-nowrap">{project.year}</span>
              </div>
              {project.members.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs font-semibold text-accent mb-3">Team Members:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {project.members.map((member, idx) => (
                      <div key={idx} className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                        <p className="font-medium text-foreground">{member.name}</p>
                        <p className="text-xs text-muted-foreground">Roll No: {member.rollNo}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
