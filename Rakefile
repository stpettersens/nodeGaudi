#
# Test nodeGaudi on local system or Travis CI.
#

task :travis => [:deps, :test]

task :deps do
	puts "Get and install dependencies via Node package manager (npm)..."
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
		puts "Testing build action (tbuild.json) for HelloWorld example program..."
		sh "../../nodeGaudi -f tbuild.json build"
		puts ""
		sh "ls -a"
		puts "\nTesting clean action (tbuild.json)..."
		sh "../../nodeGaudi -f tbuild.json clean"
		puts ""
		sh "ls -a"
		puts "\nTesting build action (tbuild.cson) for HelloWorld example program..."
		sh "../../nodeGaudi -f tbuild.cson build"
		puts ""
		sh "ls -a"
		puts "\nTesting clean action (tbuild.cson)..."
		sh "../../nodeGaudi -f tbuild.cson clean"
		puts ""
		sh "ls -a"
	end
	Dir.chdir('examples/Directories') do
		puts "Testing build action (build.json) for Directories example..."
		sh "../../nodeGaudi -f build.json build"
		puts ""
		sh "ls -a"
		puts "\nTesting clean action (build.json)..."
		sh "../../nodeGaudi -f build.json clean"
		puts ""
		sh "ls -a"
		puts "\nTesting build action (build.cson) for Directories example..."
		sh "../../nodeGaudi -f build.cson build"
		puts ""
		sh "ls -a"
		puts "\nTesting clean action (build.cson)..."
		sh "../../nodeGaudi -f build.cson clean"
		puts ""
		sh "ls -a"
end
