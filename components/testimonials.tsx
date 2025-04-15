const testimonials = [
  {
    name: "Alex M.",
    role: "Content Creator",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    content:
      "viralCuts has completely transformed how I repurpose my YouTube content. The AI-powered editing is incredible!",
  },
  {
    name: "Sarah K.",
    role: "Gaming Streamer",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    content:
      "The gaming overlays feature is genius! My TikTok engagement has increased significantly since using viralCuts.",
  },
  {
    name: "David R.",
    role: "YouTuber",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    content:
      "What used to take hours now takes minutes. viralCuts is a game-changer for content creators.",
  },
];

export function Testimonials() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-background via-purple-500/5 to-background" />

      <div className="container mx-auto px-4 relative">
        <h2 className="text-4xl md:text-5xl font-bold text-center gradient-text mb-4">
          Loved by Creators
        </h2>
        <p className="text-xl text-muted-foreground text-center mb-20 max-w-2xl mx-auto">
          Join thousands of content creators who are already using viralCuts to
          grow their audience
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative bg-background rounded-xl p-8 transition-all duration-300 hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full mr-4 border-2 border-primary/20"
                  />
                  <div>
                    <h4 className="font-semibold text-lg">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {testimonial.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
