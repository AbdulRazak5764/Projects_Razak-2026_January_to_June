export function Achievements() {
  const achievements = [
    {
      title: 'Editorial Member - International Journal',
      description: 'Editorial member for "International Journal of Sustainable Development Research" (2025-2028)',
      type: 'Editorial',
    },
    {
      title: 'Best Research Paper Award',
      description: 'Received Best Research Paper Award under research paper category, Chaitanyam 2024 awards',
      type: 'Award',
    },
    {
      title: 'Conference Reviewer',
      description: 'Reviewer for ICMLA – Algo conf 2025 at Chitkara University, HP (Aug 29-30, 2025)',
      type: 'Reviewer',
    },
    {
      title: 'Conference Reviewer',
      description: 'Reviewer for ICMLA conf 2024 at Chitkara University, HP (Feb 23-24, 2024)',
      type: 'Reviewer',
    },
    {
      title: 'Ph.D. Degree',
      description: 'Ph.D. through CUCET - 2015, Computational Nanoscience and Technology',
      type: 'Education',
    },
    {
      title: 'M.Tech Fellowship',
      description: 'M.Tech through GATE Fellowship - 2012',
      type: 'Education',
    },
    {
      title: 'Sports Achievement',
      description: 'Winners in cricket during sports meet at ICAR – CRIDA, 2022',
      type: 'Sports',
    },
    {
      title: 'Basketball Merit Certificate',
      description: 'Merit certificate in Basketball - Consecutive Regional group B games (2006-2007), Under-19, Hyderabad region',
      type: 'Sports',
    },
    {
      title: 'National Art Competition Medal',
      description: 'Certificate of Bronze Medal in Avantika Slogan Painting Competition (National Level) - 2004',
      type: 'Art',
    },
    {
      title: 'International Art Award',
      description: 'Bala Chitra Rathna Merit Award - 6th International Children\'s Art Competition (Dec 8, 2002) at Ravindra Bharathi, Hyderabad',
      type: 'Art',
    },
    {
      title: 'Junior Technologist Award',
      description: 'Excellent grade as Junior Technologist Award on National Science Day (Feb 28, 2004)',
      type: 'Science',
    },
  ]

  const typeColors: { [key: string]: string } = {
    'Award': 'bg-yellow-500/10 text-yellow-600',
    'Editorial': 'bg-blue-500/10 text-blue-600',
    'Reviewer': 'bg-purple-500/10 text-purple-600',
    'Education': 'bg-green-500/10 text-green-600',
    'Sports': 'bg-red-500/10 text-red-600',
    'Art': 'bg-pink-500/10 text-pink-600',
    'Science': 'bg-cyan-500/10 text-cyan-600',
  }

  return (
    <section id="achievements" className="py-16 md:py-24 border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-foreground mb-3">Achievements & Awards</h2>
        <p className="text-muted-foreground mb-12">11 Major Achievements across Academic, Sports, and Art domains</p>
        <div className="grid md:grid-cols-2 gap-4">
          {achievements.map((achievement, idx) => (
            <div key={idx} className="bg-card border border-border rounded-lg p-5 flex gap-3 hover:border-accent/50 transition-colors hover-lift">
              <span className="text-primary text-2xl flex-shrink-0">★</span>
              <div className="flex-1">
                <h3 className="font-bold text-foreground mb-1">{achievement.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${typeColors[achievement.type]}`}>
                  {achievement.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
