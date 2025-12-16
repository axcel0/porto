const skills = [
	{ name: "JavaScript", level: 90 },
	{ name: "TypeScript", level: 85 },
	{ name: "React / Next.js", level: 88 },
	{ name: "Node.js", level: 80 },
	{ name: "Tailwind CSS", level: 92 },
	{ name: "Python", level: 75 },
];

const projects = [
	{
		title: "E-Commerce Platform",
		description: "Full-stack e-commerce dengan Next.js, Stripe payment, dan dashboard admin.",
		tech: ["Next.js", "TypeScript", "Tailwind", "Prisma"],
		link: "#",
	},
	{
		title: "Task Management App",
		description: "Aplikasi manajemen tugas dengan fitur drag-and-drop dan real-time sync.",
		tech: ["React", "Firebase", "Material UI"],
		link: "#",
	},
	{
		title: "Portfolio Website",
		description: "Website portofolio modern dengan animasi smooth dan responsive design.",
		tech: ["Next.js", "Tailwind CSS", "Framer Motion"],
		link: "#",
	},
];

const socials = [
	{ name: "GitHub", url: "https://github.com/axcel0", icon: "🐙" },
	{ name: "LinkedIn", url: "#", icon: "💼" },
	{ name: "Email", url: "mailto:axels@example.com", icon: "📧" },
];

export default function Home() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
			{/* Navigation */}
			<nav className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-md z-50 border-b border-gray-700">
				<div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
					<span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
						Axel
					</span>
					<div className="flex gap-6 text-sm">
						<a href="#about" className="hover:text-blue-400 transition-colors">
							About
						</a>
						<a href="#skills" className="hover:text-blue-400 transition-colors">
							Skills
						</a>
						<a href="#projects" className="hover:text-blue-400 transition-colors">
							Projects
						</a>
						<a href="#contact" className="hover:text-blue-400 transition-colors">
							Contact
						</a>
					</div>
				</div>
			</nav>

			{/* Hero Section */}
			<section className="min-h-screen flex items-center justify-center px-6 pt-20">
				<div className="text-center max-w-3xl">
					<div className="mb-6">
						<div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-1">
							<div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center text-5xl">
								👨‍💻
							</div>
						</div>
					</div>
					<h1 className="text-5xl md:text-7xl font-bold mb-4">
						Hi, I'm{" "}
						<span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
							Axel
						</span>
					</h1>
					<p className="text-xl md:text-2xl text-gray-400 mb-8">
						Full-Stack Developer | UI/UX Enthusiast | Problem Solver
					</p>
					<div className="flex gap-4 justify-center">
						<a
							href="#projects"
							className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-semibold hover:opacity-90 transition-opacity"
						>
							View Projects
						</a>
						<a
							href="#contact"
							className="px-8 py-3 border border-gray-600 rounded-full font-semibold hover:border-blue-400 hover:text-blue-400 transition-colors"
						>
							Contact Me
						</a>
					</div>
				</div>
			</section>

			{/* About Section */}
			<section id="about" className="py-20 px-6">
				<div className="max-w-4xl mx-auto">
					<h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
						<span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
							About Me
						</span>
					</h2>
					<div className="bg-gray-800/50 rounded-2xl p-8 backdrop-blur-sm border border-gray-700">
						<p className="text-lg text-gray-300 leading-relaxed mb-6">
							Saya adalah seorang Full-Stack Developer yang passionate dalam membangun aplikasi web
							modern dan user-friendly. Dengan pengalaman dalam berbagai teknologi web, saya selalu
							berusaha menciptakan solusi yang efisien dan scalable.
						</p>
						<p className="text-lg text-gray-300 leading-relaxed">
							Saya percaya bahwa kode yang baik adalah kode yang clean, maintainable, dan memberikan
							pengalaman terbaik bagi pengguna. Mari berkolaborasi untuk mewujudkan ide-ide hebat
							menjadi kenyataan! 🚀
						</p>
					</div>
				</div>
			</section>

			{/* Skills Section */}
			<section id="skills" className="py-20 px-6 bg-gray-800/30">
				<div className="max-w-4xl mx-auto">
					<h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
						<span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
							Skills
						</span>
					</h2>
					<div className="grid md:grid-cols-2 gap-6">
						{skills.map((skill) => (
							<div
								key={skill.name}
								className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
							>
								<div className="flex justify-between mb-2">
									<span className="font-semibold">{skill.name}</span>
									<span className="text-blue-400">{skill.level}%</span>
								</div>
								<div className="h-2 bg-gray-700 rounded-full overflow-hidden">
									<div
										className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
										style={{ width: `${skill.level}%` }}
									/>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Projects Section */}
			<section id="projects" className="py-20 px-6">
				<div className="max-w-6xl mx-auto">
					<h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
						<span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
							Projects
						</span>
					</h2>
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						{projects.map((project) => (
							<div
								key={project.title}
								className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 hover:border-blue-500/50 transition-colors group"
							>
								<div className="h-40 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-xl mb-4 flex items-center justify-center text-4xl">
									🚀
								</div>
								<h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
									{project.title}
								</h3>
								<p className="text-gray-400 text-sm mb-4">{project.description}</p>
								<div className="flex flex-wrap gap-2 mb-4">
									{project.tech.map((tech) => (
										<span
											key={tech}
											className="px-3 py-1 bg-gray-700 rounded-full text-xs text-blue-300"
										>
											{tech}
										</span>
									))}
								</div>
								<a
									href={project.link}
									className="text-blue-400 hover:text-blue-300 text-sm font-semibold"
								>
									View Project →
								</a>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Contact Section */}
			<section id="contact" className="py-20 px-6 bg-gray-800/30">
				<div className="max-w-2xl mx-auto text-center">
					<h2 className="text-3xl md:text-4xl font-bold mb-6">
						<span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
							Let's Connect!
						</span>
					</h2>
					<p className="text-gray-400 mb-8">
						Tertarik untuk berkolaborasi atau punya project menarik? Jangan ragu untuk menghubungi
						saya!
					</p>
					<div className="flex justify-center gap-6 mb-8">
						{socials.map((social) => (
							<a
								key={social.name}
								href={social.url}
								target="_blank"
								rel="noopener noreferrer"
								className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center text-2xl hover:bg-gray-700 hover:scale-110 transition-all border border-gray-700"
							>
								{social.icon}
							</a>
						))}
					</div>
					<a
						href="mailto:axels@example.com"
						className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-semibold hover:opacity-90 transition-opacity"
					>
						📧 Send Email
					</a>
				</div>
			</section>

			{/* Footer */}
			<footer className="py-8 px-6 border-t border-gray-800">
				<div className="max-w-6xl mx-auto text-center text-gray-500">
					<p>© 2025 Axel. Built with ❤️ using Next.js & Tailwind CSS</p>
				</div>
			</footer>
		</div>
	);
}
