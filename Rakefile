#
# Test nodeGaudi on local system or Travis CI.
# 

task :travis => [:deps, :test]

task :deps do
	puts "Get dependencies and install via Node package manager (npm)..."
	sh "npm install"
	puts ""
end

task :test do
	puts "Get nodeGaudi usage information..."
	sh "./nodeGaudi -i"
	puts ""
	puts "Get nodeGaudi version..."
	sh "./nodeGaudi -v"
	puts ""
	Dir.chdir('examples/HelloWorld') do
		puts "Testing build action for HelloWorld example program..."
		sh "../../nodeGaudi -f build.json build"
		puts ""
		sh "./hw"
		puts ""
		puts "Testing clean action..."
		sh "../../nodeGaudi -f build.json clean"
		puts ""
		sh "ls -a"
	end
end
