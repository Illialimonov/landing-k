import { Sparkles, Clock, Video, Share, Wand2, Palette } from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Editing',
    description: 'Our advanced AI detects the most engaging moments from your videos automatically'
  },
  {
    icon: Clock,
    title: 'Save Hours of Work',
    description: 'Transform hours of content into viral-ready clips in just minutes'
  },
  {
    icon: Video,
    title: 'Gaming Overlays',
    description: 'Add trending gaming footage as engaging background content'
  },
  {
    icon: Share,
    title: 'TikTok Optimized',
    description: 'Get perfectly formatted vertical clips ready for TikTok success'
  },
  {
    icon: Wand2,
    title: 'Smart Transitions',
    description: 'Seamless transitions between clips for professional results'
  },
  {
    icon: Palette,
    title: 'Custom Styling',
    description: 'Add your personal brand touch with custom colors and effects'
  }
]

export function Features() {
  return (
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent" />
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold gradient-text mb-6">
            Everything you need to go viral
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features that help you create engaging content faster than ever
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group relative bg-secondary/50 rounded-xl p-8 transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="inline-block p-3 rounded-lg bg-primary/10 mb-6">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}