

export function Skills() {
    
    return (<div className="p-10 hover:cursor-default select-none ">
        <h1>Skills</h1>
        <h5 className="p-4">Languages</h5>
        <ul className="list-inside flex justify-center gap-5 pb-4">
            <li className="hover:underline">Javascript</li>
            <li className="hover:underline">Java</li>
            <li className="hover:underline">Python</li>
            <li className="hover:underline">C</li>
            <li className="hover:underline">SQL</li>
        </ul>
        <h5 className="p-4">Frameworks and Tools</h5>
        <ul className="list-inside flex justify-center gap-5 pb-4">
            <li className="hover:underline">React</li>
            <li className="hover:underline">Spring Boot</li>
            <li className="hover:underline">TailwindCSS</li>
            <li className="hover:underline">AWS CDK</li>
            <li className="hover:underline">Express</li>
            <li className="hover:underline">JUnit</li>
            <li className="hover:underline">Mockito</li>
        </ul>
        <h5 className="p-4">Technologies</h5>
        <ul className="list-inside flex justify-center gap-5 pb-4">
            <li className="hover:underline">MySQL</li>
            <li className="hover:underline">MongoDB</li>
            <li className="hover:underline">PostgresSQL</li>
        </ul>
    </div>)
}