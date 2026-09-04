<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Algebra Formula Sheet</title>
    <!-- Google Fonts -->
    <link href="https://googleapis.com" rel="stylesheet">
    <!-- MathJax for rendering math formulas -->
    <script src="https://polyfill.io"></script>
    <script id="MathJax-script" async src="https://jsdelivr.net"></script>
    <style>
        :root {
            --primary: #4f46e5;
            --primary-light: #e0e7ff;
            --text-main: #1f2937;
            --text-muted: #4b5563;
            --bg-color: #f9fafb;
            --card-bg: #ffffff;
            --border-color: #e5e7eb;
            --accent-pink: #ec4899;
            --accent-green: #10b981;
            --accent-orange: #f59e0b;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--bg-color);
            color: var(--text-main);
            line-height: 1.6;
            padding: 2rem 1rem;
        }

        .container {
            max-width: 1000px;
            margin: 0 auto;
        }

        header {
            text-align: center;
            margin-bottom: 2.5rem;
        }

        header h1 {
            font-size: 2.5rem;
            color: var(--primary);
            font-weight: 700;
            margin-bottom: 0.5rem;
        }

        header p {
            color: var(--text-muted);
            font-size: 1.1rem;
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem;
        }

        .card {
            background-color: var(--card-bg);
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
            border: 1px solid var(--border-color);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .card:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08);
        }

        .card h2 {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid var(--primary-light);
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        /* Distinct color accents for card titles */
        .card:nth-child(1) h2 { color: var(--primary); border-color: var(--primary); }
        .card:nth-child(2) h2 { color: var(--accent-pink); border-color: var(--accent-pink); }
        .card:nth-child(3) h2 { color: var(--accent-green); border-color: var(--accent-green); }
        .card:nth-child(4) h2 { color: var(--accent-orange); border-color: var(--accent-orange); }

        .formula-item {
            margin-bottom: 1rem;
            padding: 0.5rem 0;
        }

        .formula-item:last-child {
            margin-bottom: 0;
        }

        .formula-name {
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--text-muted);
            font-weight: 600;
            margin-bottom: 0.25rem;
        }

        .formula-box {
            background-color: #f8fafc;
            padding: 0.75rem;
            border-radius: 8px;
            text-align: center;
            border: 1px solid #f1f5f9;
        }

        footer {
            text-align: center;
            margin-top: 3rem;
            color: var(--text-muted);
            font-size: 0.9rem;
        }
    </style>
</head>
<body>

    <div class="container">
        <header>
            <h1>Algebra Core Formulas</h1>
            <p>A quick reference cheat sheet for essential algebraic identities and rules.</p>
        </header>

        <div class="grid">
            <!-- Card 1: Polynomial Identities -->
            <div class="card">
                <h2>Polynomial Identities</h2>
                <div class="formula-item">
                    <div class="formula-name">Square of a Binomial (+)</div>
                    <div class="formula-box">\((a + b)^2 = a^2 + 2ab + b^2\)</div>
                </div>
                <div class="formula-item">
                    <div class="formula-name">Square of a Binomial (-)</div>
                    <div class="formula-box">\((a - b)^2 = a^2 - 2ab + b^2\)</div>
                </div>
                <div class="formula-item">
                    <div class="formula-name">Difference of Squares</div>
                    <div class="formula-box">\(a^2 - b^2 = (a - b)(a + b)\)</div>
                </div>
            </div>

            <!-- Card 2: Exponent Rules -->
            <div class="card">
                <h2>Laws of Exponents</h2>
                <div class="formula-item">
                    <div class="formula-name">Product Rule</div>
                    <div class="formula-box">\(x^m \cdot x^n = x^{m+n}\)</div>
                </div>
                <div class="formula-item">
                    <div class="formula-name">Quotient Rule</div>
                    <div class="formula-box">\(\frac{x^m}{x^n} = x^{m-n}\)</div>
                </div>
                <div class="formula-item">
                    <div class="formula-name">Power of a Power</div>
                    <div class="formula-box">\((x^m)^n = x^{m \cdot n}\)</div>
                </div>
            </div>

            <!-- Card 3: Quadratic Equations -->
            <div class="card">
                <h2>Quadratic Equations</h2>
                <div class="formula-item">
                    <div class="formula-name">Standard Form</div>
                    <div class="formula-box">\(ax^2 + bx + c = 0\)</div>
                </div>
                <div class="formula-item">
                    <div class="formula-name">Quadratic Formula</div>
                    <div class="formula-box">\(x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}\)</div>
                </div>
                <div class="formula-item">
                    <div class="formula-name">Discriminant</div>
                    <div class="formula-box">\(\Delta = b^2 - 4ac\)</div>
                </div>
            </div>

            <!-- Card 4: Logarithms -->
            <div class="card">
                <h2>Logarithm Properties</h2>
                <div class="formula-item">
                    <div class="formula-name">Product Rule</div>
                    <div class="formula-box">\(\log_b(xy) = \log_b(x) + \log_b(y)\)</div>
                </div>
                <div class="formula-item">
                    <div class="formula-name">Quotient Rule</div>
                    <div class="formula-box">\(\log_b\left(\frac{x}{y}\right) = \log_b(x) - \log_b(y)\)</div>
                </div>
                <div class="formula-item">
                    <div class="formula-name">Power Rule</div>
                    <div class="formula-box">\(\log_b(x^k) = k \cdot \log_b(x)\)</div>
                </div>
            </div>
        </div>

        <footer>
            <p>Designed with clean HTML5 & CSS3. Rendered via MathJax.</p>
        </footer>
    </div>

</body>
</html>
