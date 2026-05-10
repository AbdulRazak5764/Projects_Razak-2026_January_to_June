export function Skills() {
  return (
    <section id="skills" className="py-16 md:py-24 border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-foreground mb-12">Skills & Expertise</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-accent mb-4">Programming Languages</h3>
            <div className="flex flex-wrap gap-2">
              {['C++', 'MATLAB', 'Python', 'R'].map((lang) => (
                <span key={lang} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/80 transition-colors">
                  {lang}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-accent mb-4">Subjects Taught</h3>
            <div className="space-y-2 text-muted-foreground">
              {['Data Structures', 'Database Management Systems', 'Data Visualization', 'Introduction to Data Science', 'Design and Analysis of Algorithms'].map((subject) => (
                <div key={subject} className="flex gap-2">
                  <span className="text-primary">→</span>
                  <span>{subject}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <div>
            <h3 className="text-xl font-semibold text-accent mb-4">Area of Interest</h3>
            <div className="space-y-2 text-muted-foreground">
              {['Computational Nanoscience and Technology', 'Climatic Data Analysis', 'Data Science and Machine Learning', 'Healthcare Applications', 'Data Analytics and Visualization'].map((interest) => (
                <div key={interest} className="flex gap-2">
                  <span className="text-primary">★</span>
                  <span>{interest}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
