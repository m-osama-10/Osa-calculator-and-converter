"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePreferences } from "@/store";

const ARTICLE_CONTENT: Record<string, {
  category: string;
  categoryAr: string;
  titleEn: string;
  titleAr: string;
  contentEn: string[];
  contentAr: string[];
}> = {
  "how-to-use-bmi-calculator": {
    category: "Health",
    categoryAr: "الصحة",
    titleEn: "How to Use the BMI Calculator: A Complete Guide",
    titleAr: "كيفية استخدام حاسبة مؤشر كتلة الجسم (BMI): دليل كامل",
    contentEn: [
      "Body Mass Index (BMI) is a simple measure that uses your height and weight to work out if your weight is healthy. The BMI calculation divides an adult's weight in kilograms by their height in metres squared.",
      "The formula is: BMI = weight (kg) / height² (m²). For example, if you weigh 70 kg and are 1.75 m tall, your BMI = 70 / (1.75)² = 22.86.",
      "BMI Categories: Underweight (BMI < 18.5), Normal weight (18.5–24.9), Overweight (25–29.9), Obese (BMI ≥ 30).",
      "BMI is a useful screening tool but it doesn't directly measure body fat. Very muscular people may have a high BMI but low body fat. For a more complete picture, use our Body Fat Calculator alongside BMI.",
      "To use the BMI Calculator in Zoma Calculator: 1) Open the Health & Fitness category, 2) Click on BMI Calculator, 3) Enter your weight and height, 4) The result appears instantly with your category.",
      "For best results, weigh yourself in the morning before eating, and measure your height without shoes. Track your BMI over time to monitor changes.",
    ],
    contentAr: [
      "مؤشر كتلة الجسم (BMI) هو مقياس بسيط يستخدم طولك ووزنك لمعرفة ما إذا كان وزنك صحيًا. يقسم حساب BMI وزن الشخص بالكيلوجرام على مربع طوله بالأمتار.",
      "الصيغة هي: BMI = الوزن (كجم) / الطول² (م²). مثال: إذا كان وزنك 70 كجم وطولك 1.75 م، فإن BMI = 70 / (1.75)² = 22.86.",
      "فئات BMI: نحافة (BMI < 18.5)، وزن طبيعي (18.5–24.9)، زيادة في الوزن (25–29.9)، سمنة (BMI ≥ 30).",
      "BMI أداة فحص مفيدة لكنها لا تقيس الدهون في الجسم مباشرة. الأشخاص العضليون قد يكون لديهم BMI مرتفع لكن دهون قليلة. للحصول على صورة أشمل، استخدم حاسبة نسبة الدهون بجانب BMI.",
      "لاستخدام حاسبة BMI في Zoma Calculator: 1) افتح فئة الصحة واللياقة، 2) اضغط على حاسبة BMI، 3) أدخل وزنك وطولك، 4) تظهر النتيجة فورًا مع التصنيف.",
      "للحصول على أفضل النتائج، قف على الميزان في الصباح قبل الأكل، وقس طولك بدون حذاء. تابع مؤشر BMI بمرور الوقت لمراقبة التغيرات.",
    ],
  },
  "molarity-vs-molality": {
    category: "Chemistry",
    categoryAr: "الكيمياء",
    titleEn: "Molarity vs Molality: What's the Difference?",
    titleAr: "المولارية مقابل المولالية: ما الفرق؟",
    contentEn: [
      "Molarity (M) and molality (m) are two ways to express concentration. While they sound similar, they differ in a crucial way: molarity depends on volume, while molality depends on mass.",
      "Molarity = moles of solute / liters of solution (mol/L). Molality = moles of solute / kg of solvent (mol/kg).",
      "The key difference: molarity changes with temperature (because volume expands/contracts), while molality stays constant (mass doesn't change with temperature).",
      "When to use molarity: Most lab work, titrations, solution preparation. When to use molality: Boiling point elevation, freezing point depression, colligative properties.",
      "Example: 1 mol NaCl in 1 L water = 1 M (molarity). 1 mol NaCl in 1 kg water = 1 m (molality). For dilute aqueous solutions, M ≈ m because 1 L water ≈ 1 kg.",
      "Use our Molarity and Molality calculators in the Chemistry category to practice with real values.",
    ],
    contentAr: [
      "المولارية (M) والمولالية (m) طريقتان للتعبير عن التركيز. رغم تشابه الاسمين، إلا أنهما يختلفان بشكل جوهري: المولارية تعتمد على الحجم، بينما المولالية تعتمد على الكتلة.",
      "المولارية = مولات المذاب / لترات المحلول (مول/لتر). المولالية = مولات المذاب / كجم من المذيب (مول/كجم).",
      "الفرق الرئيسي: المولارية تتغير مع الحرارة (لأن الحجم يتمدد/ينكمش)، بينما المولالية تبقى ثابتة (الكتلة لا تتغير مع الحرارة).",
      "متى تستخدم المولارية: معظم أعمال المختبر، المعايرة، تحضير المحاليل. متى تستخدم المولالية: رفع درجة الغليان، خفض درجة التجمد، الخواص التراذمية.",
      "مثال: 1 مول NaCl في 1 لتر ماء = 1 M (مولارية). 1 مول NaCl في 1 كجم ماء = 1 m (مولالية). للمحاليل المائية المخففة، M ≈ m لأن 1 لتر ماء ≈ 1 كجم.",
      "استخدم حاسبات المولارية والمولالية في فئة الكيمياء للتدريب بقيم حقيقية.",
    ],
  },
  "understanding-ph-scale": {
    category: "Chemistry",
    categoryAr: "الكيمياء",
    titleEn: "Understanding the pH Scale: Acids, Bases, and Indicators",
    titleAr: "فهم مقياس pH: الأحماض والقواعد والمؤشرات",
    contentEn: [
      "The pH scale measures how acidic or basic a substance is, ranging from 0 (very acidic) to 14 (very basic), with 7 being neutral.",
      "The formula is: pH = -log₁₀([H⁺]). A change of 1 pH unit means a 10-fold change in hydrogen ion concentration. For example, pH 3 has 10 times more H⁺ than pH 4.",
      "Common pH values: Lemon juice (2.0), Vinegar (2.5), Coffee (5.0), Pure water (7.0), Baking soda (8.3), Soap (9.5), Bleach (12.5).",
      "You can make a natural pH indicator at home using red cabbage. Blend red cabbage with water, strain the liquid, and add a few drops to any solution. Acids turn it red/pink, bases turn it green/yellow.",
      "pH + pOH = 14 (at 25°C). So if you know the pH, you can calculate pOH and vice versa. [H⁺] × [OH⁻] = 10⁻¹⁴ (water dissociation constant).",
      "Use our pH Calculator in the Chemistry category to calculate pH from [H⁺] or vice versa, along with pOH and [OH⁻].",
    ],
    contentAr: [
      "مقياس pH يقيس مدى حموضة أو قاعدية مادة، ويتراوح من 0 (حمضي جدًا) إلى 14 (قاعدي جدًا)، مع 7 كمتعادل.",
      "الصيغة هي: pH = -log₁₀([H⁺]). تغير وحدة pH واحدة يعني تغير 10 أضعاف في تركيز أيونات الهيدروجين. مثال: pH 3 يحتوي على 10 أضعاف H⁺ مقارنة بـ pH 4.",
      "قيم pH الشائعة: عصير الليمون (2.0)، الخل (2.5)، القهوة (5.0)، الماء النقي (7.0)، بيكربونات الصوديوم (8.3)، الصابون (9.5)، المبيض (12.5).",
      "يمكنك صنع مؤشر pH طبيعي في المنزل باستخدام الملفوف الأحمر. اخلط الملفوف الأحمر مع الماء، صفِّ السائل، وأضف بضع قطرات لأي محلول. الأحماض تحوله لأحمر/وردي، والقواعد لأخضر/أصفر.",
      "pH + pOH = 14 (عند 25°م). لذا إذا عرفت pH يمكنك حساب pOH والعكس. [H⁺] × [OH⁻] = 10⁻¹⁴ (ثابت تفكك الماء).",
      "استخدم حاسبة pH في فئة الكيمياء لحساب pH من [H⁺] أو العكس، مع pOH و [OH⁻].",
    ],
  },
  "unit-conversion-guide": {
    category: "Converters",
    categoryAr: "المحولات",
    titleEn: "Complete Guide to Unit Conversions: Length, Weight, Volume & More",
    titleAr: "دليل كامل لتحويلات الوحدات: الطول، الوزن، الحجم والمزيد",
    contentEn: [
      "Unit conversion is the process of changing a quantity from one unit to another. The key is knowing the conversion factor between units.",
      "Length: 1 meter = 100 cm = 1000 mm = 3.281 ft = 39.37 in = 0.001 km = 0.000621 mile. To convert, multiply by the factor. Example: 5 km = 5 × 1000 = 5000 m.",
      "Weight: 1 kg = 1000 g = 2.205 lb = 35.27 oz. Temperature is special: °F = (°C × 9/5) + 32, and K = °C + 273.15. You can't just multiply — you need the formula.",
      "Volume: 1 liter = 1000 mL = 0.264 gal (US) = 33.81 fl oz. Area: 1 m² = 10000 cm² = 10.764 ft². Speed: 1 m/s = 3.6 km/h = 2.237 mph.",
      "The Zoma Calculator platform has 30+ unit converters covering length, weight, area, volume, temperature, speed, pressure, energy, data storage, and more — all with live conversion as you type.",
      "Pro tip: When converting, always include units in your calculation to catch mistakes. If the units don't cancel correctly, you've made an error.",
    ],
    contentAr: [
      "تحويل الوحدات هو عملية تغيير كمية من وحدة إلى أخرى. المفتاح هو معرفة عامل التحويل بين الوحدات.",
      "الطول: 1 متر = 100 سم = 1000 مم = 3.281 قدم = 39.37 بوصة = 0.001 كم. للتحويل، اضرب في العامل. مثال: 5 كم = 5 × 1000 = 5000 م.",
      "الوزن: 1 كجم = 1000 جم = 2.205 رطل = 35.27 أونصة. الحرارة خاصة: °ف = (°م × 9/5) + 32، و ك = °م + 273.15. لا يمكنك مجرد الضرب — تحتاج الصيغة.",
      "الحجم: 1 لتر = 1000 مل = 0.264 جالون (أمريكي) = 33.81 أونصة سائلة. المساحة: 1 م² = 10000 سم² = 10.764 قدم². السرعة: 1 م/ث = 3.6 كم/س = 2.237 ميل/س.",
      "منصة Zoma Calculator بها أكثر من 30 محوّل وحدة يغطي الطول، الوزن، المساحة، الحجم، الحرارة، السرعة، الضغط، الطاقة، تخزين البيانات والمزيد — جميعها بتحويل مباشر أثناء الكتابة.",
      "نصيحة: عند التحويل، ضمّن دائمًا الوحدات في حسابك لاكتشاف الأخطاء. إذا لم تلغَ الوحدات بشكل صحيح، فقد ارتكبت خطأ.",
    ],
  },
  "pcr-and-dna-amplification": {
    category: "Biology",
    categoryAr: "البيولوجيا",
    titleEn: "PCR and DNA Amplification Explained",
    titleAr: "شرح PCR وتضخيم DNA",
    contentEn: [
      "Polymerase Chain Reaction (PCR) is a technique that amplifies (copies) a specific DNA segment, producing millions to billions of copies from a single starting molecule.",
      "PCR has three main steps per cycle: 1) Denaturation (95°C) — DNA strands separate. 2) Annealing (50-65°C) — primers bind to target sequences. 3) Extension (72°C) — Taq polymerase builds new strands.",
      "Theoretically, each cycle doubles the DNA. After n cycles: copies = initial × 2ⁿ. For 30 cycles: 2³⁰ ≈ 1 billion copies. Real PCR efficiency is 80-100% due to reagent depletion.",
      "Key components: Template DNA, Primers (forward & reverse), Taq polymerase (heat-stable), dNTPs (building blocks), Buffer, Mg²⁺ (cofactor).",
      "Melting temperature (Tm) of primers should be 55-65°C, and the annealing temperature is typically set 3-5°C below Tm. GC content should be 40-60%.",
      "Use our PCR Amplification Calculator and Melting Temperature (Tm) Calculator in the Molecular Biology category to plan your experiments.",
    ],
    contentAr: [
      "تفاعل البوليميراز المتسلسل (PCR) هو تقنية تضخف (تنسخ) جزء محدد من DNA، منتجة ملايين إلى مليارات النسخ من جزيء ابتدائي واحد.",
      "PCR له ثلاث خطوات رئيسية في كل دورة: 1) التمسخ (95°م) — تنفصل شريطا DNA. 2) التلدين (50-65°م) — ترتبط البرايمرات بالتسلسلات المستهدفة. 3) الامتداد (72°م) — يبني بوليميراز Taq شريط جديدة.",
      "نظريًا، كل دورة تضاعف DNA. بعد n دورة: النسخ = الابتدائي × 2ⁿ. لـ 30 دورة: 2³⁰ ≈ مليار نسخة. كفاءة PCR الحقيقية 80-100% بسبب استنزاف الكواشف.",
      "المكونات الرئيسية: قالب DNA، بروايمر (أمامي وخلفي)، بوليميراز Taq (مقاوم للحرارة)، dNTPs (وحدات البناء)، بفر، Mg²⁺ (عامل مساعد).",
      "حرارة الانصهار (Tm) للبرايمرات يجب أن تكون 55-65°م، ودرجة حرارة التلدين تُضبط عادة 3-5°م أقل من Tm. محتوى GC يجب أن يكون 40-60%.",
      "استخدم حاسبة تضخيم PCR وحاسبة حرارة الانصهار (Tm) في فئة البيولوجيا الجزيئية لتخطيط تجاربك.",
    ],
  },
  "hardy-weinberg-equilibrium": {
    category: "Genetics",
    categoryAr: "الوراثة",
    titleEn: "Hardy-Weinberg Equilibrium: Principles and Applications",
    titleAr: "توازن هاردي-واينبرغ: المبادئ والتطبيقات",
    contentEn: [
      "The Hardy-Weinberg principle states that allele and genotype frequencies in a population remain constant from generation to generation in the absence of evolutionary influences.",
      "The equation: p² + 2pq + q² = 1, where p = frequency of dominant allele, q = frequency of recessive allele, p² = homozygous dominant, 2pq = heterozygous, q² = homozygous recessive.",
      "Example: If 4% of a population has a recessive disorder (q² = 0.04), then q = 0.20, p = 0.80. Carriers (2pq) = 2 × 0.80 × 0.20 = 0.32 = 32% of the population.",
      "Five conditions for HWE: 1) No mutations, 2) No migration, 3) No natural selection, 4) Random mating, 5) Large population. If any is violated, the population is evolving.",
      "To test if a population is in HWE, use the Chi-square test: χ² = Σ(observed - expected)² / expected. If χ² < 3.84 (df=1, p=0.05), the population is in equilibrium.",
      "Use our Hardy-Weinberg and Allele Frequency calculators in the Molecular Genetics category to practice with real population data.",
    ],
    contentAr: [
      "مبدأ هاردي-واينبرغ ينص على أن ترددات الأليل والتركيب الوراثي في مجتمع تبقى ثابتة من جيل لآخر في غياب المؤثرات التطورية.",
      "المعادلة: p² + 2pq + q² = 1، حيث p = تردد الأليل السائد، q = تردد الأليل المتنحي، p² = سائد متماثل، 2pq = متغاير، q² = متنحي متماثل.",
      "مثال: إذا كان 4% من المجتمع يعاني من اضطراب متنحٍ (q² = 0.04)، فإن q = 0.20، p = 0.80. الحاملون (2pq) = 2 × 0.80 × 0.20 = 0.32 = 32% من المجتمع.",
      "خمسة شروط لتوازن HWE: 1) لا طفرات، 2) لا هجرة، 3) لا انتقاء طبيعي، 4) تزاوج عشوائي، 5) مجتمع كبير. إذا انتهك أي شرط، المجتمع يتطور.",
      "لاختبار ما إذا كان المجتمع في توازن HWE، استخدم اختبار كاي²: χ² = Σ(مرصود - متوقع)² / متوقع. إذا χ² < 3.84 (درجة حرية=1، p=0.05)، المجتمع في توازن.",
      "استخدم حاسبة هاردي-واينبرغ وحاسبة تردد الأليل في فئة الوراثة الجزيئية للتدريب ببيانات مجتمعية حقيقية.",
    ],
  },
  "fertilizer-calculation-guide": {
    category: "Agriculture",
    categoryAr: "الزراعة",
    titleEn: "Fertilizer Calculation Guide: NPK, Urea, and More",
    titleAr: "دليل حساب الأسمدة: NPK، اليوريا، والمزيد",
    contentEn: [
      "Fertilizer recommendations are given in kg of pure nutrient (N, P₂O₅, or K₂O) per feddan. To find how much actual fertilizer to apply, divide by the nutrient percentage.",
      "Common fertilizers: Urea (46% N), Ammonium nitrate (33.5% N), Ammonium sulfate (20.6% N), Single superphosphate (15% P₂O₅), Triple superphosphate (46% P₂O₅), DAP (18% N, 46% P₂O₅), MOP (60% K₂O), SOP (50% K₂O).",
      "Example: If the recommendation is 80 kg N per feddan and you use urea (46% N): Fertilizer needed = 80 / 0.46 = 173.9 kg urea per feddan.",
      "For 5 feddans: 173.9 × 5 = 869.6 kg total. In 50 kg bags: 869.6 / 50 = 17.4 → 18 bags.",
      "Typical N recommendations (kg/feddan): Wheat 60-80, Corn 120-150, Cotton 80-100, Rice 70-90, Potato 100-120. Split application is recommended for better efficiency.",
      "Use our Fertilizer Calculator in the Agriculture category — it supports feddan/acre/hectare, 9 fertilizer types, and calculates bags needed.",
    ],
    contentAr: [
      "تُعطى توصيات الأسمدة بـ كجم من العنصر النقي (N أو P₂O₅ أو K₂O) للفدان. لمعرفة كمية السماد الفعلية، اقسم على نسبة العنصر.",
      "الأسمدة الشائعة: يوريا (46% N)، نترات أمونيوم (33.5% N)، سلفات أمونيوم (20.6% N)، سوبر فوسفات أحادي (15% P₂O₅)، سوبر فوسفات ثلاثي (46% P₂O₅)، DAP (18% N، 46% P₂O₅)، كلوريد بوتاسيوم (60% K₂O)، سلفات بوتاسيوم (50% K₂O).",
      "مثال: إذا كانت التوصية 80 كجم N للفدان وتستخدم يوريا (46% N): السماد المطلوب = 80 / 0.46 = 173.9 كجم يوريا للفدان.",
      "لـ 5 فدادن: 173.9 × 5 = 869.6 كجم إجمالي. بأكياس 50 كجم: 869.6 / 50 = 17.4 → 18 كيس.",
      "توصيات N النموذجية (كجم/فدان): قمح 60-80، ذرة 120-150، قطن 80-100، أرز 70-90، بطاطس 100-120. يُنصح بالتقسيم على دفعات لكفاءة أفضل.",
      "استخدم حاسبة الأسمدة في فئة الزراعة — تدعم فدان/أكر/هكتار، 9 أنواع أسمدة، وتحسب الأكياس المطلوبة.",
    ],
  },
  "irrigation-water-calculation": {
    category: "Agriculture",
    categoryAr: "الزراعة",
    titleEn: "How to Calculate Irrigation Water Needs",
    titleAr: "كيفية حساب احتياجات ماء الري",
    contentEn: [
      "Crop water requirement (ETc) is the amount of water a crop needs, measured in mm/day. It depends on crop type, growth stage, and climate. Summer crops need 6-8 mm/day, winter crops 3-5 mm/day.",
      "1 mm of water over 1 feddan (4200 m²) = 4.2 m³. So if ETc = 6 mm/day, one feddan needs 6 × 4.2 = 25.2 m³/day.",
      "Irrigation system efficiency: Drip 90%, Sprinkler 75%, Flood 60%. To find actual water needed, divide ETc by efficiency. Example: Drip at 90% → 25.2 / 0.9 = 28 m³/day.",
      "Irrigation interval: Drip 1-3 days, Sprinkler 3-5 days, Flood 7-14 days. Water per irrigation = daily need × interval days.",
      "Example: Tomato in 2 feddans, drip irrigation, ETc = 6 mm/day, interval = 3 days. Water = (6 × 3 × 4.2 × 2) / 0.9 = 168 m³ per irrigation. Duration = 168 / 50 (flow rate) = 3.36 hours.",
      "Use our Irrigation Water Calculator in the Agriculture category — it supports all area units, 3 irrigation systems, and calculates duration.",
    ],
    contentAr: [
      "احتياج المحصول من الماء (ETc) هو كمية الماء التي يحتاجها المحصول، وتُقاس بمم/يوم. يعتمد على نوع المحصول، مرحلة النمو، والمناخ. المحاصيل الصيفية تحتاج 6-8 مم/يوم، الشتوية 3-5 مم/يوم.",
      "1 مم ماء على فدان (4200 م²) = 4.2 م³. فإذا كان ETc = 6 مم/يوم، يحتاج الفدان 6 × 4.2 = 25.2 م³/يوم.",
      "كفاءة نظام الري: تنقيط 90%، رشاشات 75%، غمر 60%. لمعرفة الماء الفعلي المطلوب، اقسم ETc على الكفاءة. مثال: تنقيط 90% ← 25.2 / 0.9 = 28 م³/يوم.",
      "فترة الري: تنقيط 1-3 أيام، رشاشات 3-5 أيام، غمر 7-14 يوم. ماء كل رية = الاحتياج اليومي × عدد الأيام.",
      "مثال: طماطم في 2 فدان، ري بالتنقيط، ETc = 6 مم/يوم، فترة 3 أيام. الماء = (6 × 3 × 4.2 × 2) / 0.9 = 168 م³ كل رية. المدة = 168 / 50 (معدل التدفق) = 3.36 ساعة.",
      "استخدم حاسبة ماء الري في فئة الزراعة — تدعم كل وحدات المساحة، 3 أنظمة ري، وتحسب المدة.",
    ],
  },
  "compound-interest-explained": {
    category: "Finance",
    categoryAr: "المالية",
    titleEn: "Compound Interest Explained: How Your Money Grows",
    titleAr: "شرح الفائدة المركبة: كيف ينمو أموالك",
    contentEn: [
      "Compound interest is interest calculated on the initial principal and also on the accumulated interest of previous periods. It's the most powerful force in finance.",
      "The formula: A = P(1 + r/n)^(nt), where A = final amount, P = principal, r = annual rate, n = compounds per year, t = years.",
      "Example: $10,000 invested at 7% annual rate, compounded monthly, for 10 years: A = 10000(1 + 0.07/12)^(12×10) = $20,096. Interest earned = $10,096.",
      "The power of compounding: Doubling the time more than doubles the result. At 7%, $10,000 becomes $19,672 in 10 years, $38,697 in 20 years, and $76,123 in 30 years.",
      "Rule of 72: To estimate how long it takes to double your money, divide 72 by the interest rate. At 7%: 72/7 ≈ 10.3 years. At 10%: 72/10 = 7.2 years.",
      "Use our Compound Interest Calculator in the Finance category to experiment with different principal, rates, and time periods.",
    ],
    contentAr: [
      "الفائدة المركبة هي فائدة تُحسب على المبلغ الأصلي وأيضًا على الفائدة المتراكمة من الفترات السابقة. إنها أقوى قوة في التمويل.",
      "الصيغة: A = P(1 + r/n)^(nt)، حيث A = المبلغ النهائي، P = المبلغ الأصلي، r = المعدل السنوي، n = مرات التركيب سنويًا، t = السنوات.",
      "مثال: 10,000$ مستثمرة بمعدل 7% سنويًا، تركيب شهري، لمدة 10 سنوات: A = 10000(1 + 0.07/12)^(12×10) = 20,096$. الفائدة المكتسبة = 10,096$.",
      "قوة التركيب: مضاعفة الوقت أكثر من مضاعفة النتيجة. عند 7%، 10,000$ تصبح 19,672$ في 10 سنوات، 38,697$ في 20 سنة، و 76,123$ في 30 سنة.",
      "قاعدة 72: لتقدير المدة اللازمة لمضاعفة أموالك، اقسم 72 على معدل الفائدة. عند 7%: 72/7 ≈ 10.3 سنوات. عند 10%: 72/10 = 7.2 سنوات.",
      "استخدم حاسبة الفائدة المركبة في فئة المالية للتجربة بمبالغ ومعدلات ومدد مختلفة.",
    ],
  },
  "percentage-calculation-tricks": {
    category: "Math",
    categoryAr: "الرياضيات",
    titleEn: "Percentage Calculation Tricks and Tips",
    titleAr: "حيل ونصائح لحساب النسب المئوية",
    contentEn: [
      "A percentage is a number expressed as a fraction of 100. The word comes from Latin 'per centum' meaning 'by the hundred'. 50% = 50/100 = 0.5.",
      "Three main calculations: 1) X% of Y = (X/100) × Y. Example: 25% of 200 = 0.25 × 200 = 50. 2) X is what % of Y = (X/Y) × 100. Example: 50 is 25% of 200. 3) % change = ((new - old) / old) × 100.",
      "Mental math tricks: 10% of any number = move decimal one place left. 10% of 450 = 45. Then 5% = half of 10% = 22.5. 20% = double 10% = 90.",
      "To find 15%: calculate 10%, then add half of it. 15% of 80 = 8 (10%) + 4 (5%) = 12. To find 25%: divide by 4. 25% of 120 = 30.",
      "Discount example: A $200 item with 25% off. Savings = 200 × 0.25 = $50. Final price = $150. Or: Final = 200 × (1 - 0.25) = 200 × 0.75 = $150.",
      "Use our Percentage Calculator in the Basic Calculators category — it handles all three percentage modes with step-by-step solutions.",
    ],
    contentAr: [
      "النسبة المئوية هي رقم معبّر عنه ككسر من 100. الكلمة من اللاتينية 'per centum' بمعنى 'لكل مئة'. 50% = 50/100 = 0.5.",
      "ثلاث حسابات رئيسية: 1) X% من Y = (X/100) × Y. مثال: 25% من 200 = 0.25 × 200 = 50. 2) X يمثل كم % من Y = (X/Y) × 100. مثال: 50 يمثل 25% من 200. 3) التغير % = ((الجديد - القديم) / القديم) × 100.",
      "حيل حسابية ذهنية: 10% من أي رقم = انقل الفاصلة منزلة واحدة لليسار. 10% من 450 = 45. ثم 5% = نصف 10% = 22.5. 20% = ضعف 10% = 90.",
      "لإيجاد 15%: احسب 10%، ثم أضف نصفها. 15% من 80 = 8 (10%) + 4 (5%) = 12. لإيجاد 25%: اقسم على 4. 25% من 120 = 30.",
      "مثال خصم: منتج 200$ بخصم 25%. التوفير = 200 × 0.25 = 50$. السعر النهائي = 150$. أو: النهائي = 200 × (1 - 0.25) = 200 × 0.75 = 150$.",
      "استخدم حاسبة النسبة المئوية في فئة الحاسبات الأساسية — تتعامل مع الأوضاع الثلاثة مع حل خطوة بخطوة.",
    ],
  },
  "loan-emi-calculation": {
    category: "Finance",
    categoryAr: "المالية",
    titleEn: "How Loan EMI is Calculated: Formula and Examples",
    titleAr: "كيف يُحسب قسط القرض (EMI): الصيغة والأمثلة",
    contentEn: [
      "EMI (Equated Monthly Installment) is the fixed amount you pay every month to repay a loan. It includes both principal and interest portions.",
      "The formula: EMI = P × r × (1+r)^n / ((1+r)^n - 1), where P = loan amount, r = monthly interest rate (annual/12/100), n = number of months.",
      "Example: Loan of $100,000 at 5% annual rate for 10 years (120 months). r = 5/12/100 = 0.00417. EMI = 100000 × 0.00417 × (1.00417)^120 / ((1.00417)^120 - 1) = $1,061.",
      "Total payment = EMI × months = 1,061 × 120 = $127,320. Total interest = $27,320. The interest portion is higher in early months and decreases over time.",
      "Tips: Shorter tenure = higher EMI but less total interest. Longer tenure = lower EMI but more total interest. A 15-year loan at 5% saves ~50% interest compared to a 30-year loan.",
      "Use our Loan/EMI Calculator in the Finance category — it shows monthly payment, total interest, and a visual breakdown.",
    ],
    contentAr: [
      "القسط الشهري (EMI) هو المبلغ الثابت الذي تدفعه كل شهر لسداد قرض. يشمل جزءًا من الأصل وجزءًا من الفائدة.",
      "الصيغة: القسط = P × r × (1+r)^n / ((1+r)^n - 1)، حيث P = مبلغ القرض، r = معدل الفائدة الشهري (السنوي/12/100)، n = عدد الأشهر.",
      "مثال: قرض 100,000$ بمعدل 5% سنوي لمدة 10 سنوات (120 شهر). r = 5/12/100 = 0.00417. القسط = 100000 × 0.00417 × (1.00417)^120 / ((1.00417)^120 - 1) = 1,061$.",
      "إجمالي السداد = القسط × الأشهر = 1,061 × 120 = 127,320$. إجمالي الفائدة = 27,320$. جزء الفائدة أعلى في الأشهر الأولى وينخفض بمرور الوقت.",
      "نصائح: مدة أقصر = قسط أعلى لكن فائدة إجمالية أقل. مدة أطول = قسط أقل لكن فائدة أكثر. قرض 15 سنة بمعدل 5% يوفر ~50% فائدة مقارنة بقرض 30 سنة.",
      "استخدم حاسبة القرض/القسط في فئة المالية — تعرض القسط الشهري، إجمالي الفائدة، وتفصيلًا مرئيًا.",
    ],
  },
  "periodic-table-guide": {
    category: "Chemistry",
    categoryAr: "الكيمياء",
    titleEn: "Navigating the Periodic Table: A Beginner's Guide",
    titleAr: "تصفح الجدول الدوري: دليل للمبتدئين",
    contentEn: [
      "The periodic table organizes all 118 known elements by atomic number (number of protons). Each element has a unique symbol (e.g., H for Hydrogen, O for Oxygen, Fe for Iron).",
      "Periods (rows): There are 7 periods. Moving left to right, atomic number increases. Elements in the same period have the same number of electron shells.",
      "Groups (columns): There are 18 groups. Elements in the same group have similar chemical properties because they have the same number of valence electrons.",
      "Major categories: Alkali metals (Group 1, very reactive), Alkaline earth metals (Group 2), Transition metals (Groups 3-12), Halogens (Group 17, very reactive nonmetals), Noble gases (Group 18, inert).",
      "Reading an element card: Atomic number (top), Symbol (center), Name, Atomic mass (bottom). For example, Carbon: #6, C, Carbon, 12.011 g/mol. Electron configuration: [He] 2s² 2p².",
      "Use our Interactive Periodic Table in the Chemistry category — click any element to see its full details including atomic mass, electron configuration, and category.",
    ],
    contentAr: [
      "الجدول الدوري ينظم كل العناصر الـ 118 المعروفة حسب العدد الذري (عدد البروتونات). كل عنصر له رمز فريد (مثل H للهيدروجين، O للأكسجين، Fe للحديد).",
      "الدورات (الصفوف): توجد 7 دورات. من اليسار لليمين، يزداد العدد الذري. العناصر في نفس الدورة لها نفس عدد مستويات الإلكترونات.",
      "المجموعات (الأعمدة): توجد 18 مجموعة. العناصر في نفس المجموعة لها خواص كيميائية متشابهة لأن لها نفس عدد إلكترونات التكافؤ.",
      "التصنيفات الرئيسية: الفلزات القلوية (المجموعة 1، شديدة التفاعل)، الفلزات القلوية الترابية (المجموعة 2)، الفلزات الانتقالية (المجموعات 3-12)، الهالوجينات (المجموعة 17، شديدة التفاعل)، الغازات النبيلة (المجموعة 18، خاملة).",
      "قراءة بطاقة العنصر: العدد الذري (أعلى)، الرمز (وسط)، الاسم، الكتلة الذرية (أسفل). مثال: الكربون: #6، C، Carbon، 12.011 جم/مول. توزيع الإلكترونات: [He] 2s² 2p².",
      "استخدم الجدول الدوري التفاعلي في فئة الكيمياء — اضغط على أي عنصر لرؤية تفاصيله الكاملة بما في ذلك الكتلة الذرية، توزيع الإلكترونات، والتصنيف.",
    ],
  },
};

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const lang = usePreferences((s) => s.language);
  const isAr = lang === "ar";

  const slug = params.slug as string;
  const article = ARTICLE_CONTENT[slug];

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-sm text-muted-foreground mb-4">
            {isAr ? "المقال غير موجود" : "Article not found"}
          </p>
          <Button onClick={() => router.push("/knowledge")} variant="outline" size="sm">
            {isAr ? "العودة لمركز المعرفة" : "Back to Knowledge Center"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Button
          onClick={() => router.push("/knowledge")}
          variant="ghost"
          size="sm"
          className="mb-4 gap-1"
        >
          {isAr ? <ArrowRight className="h-3 w-3" /> : <ArrowLeft className="h-3 w-3" />}
          {isAr ? "العودة للمقالات" : "Back to Articles"}
        </Button>

        <Badge variant="secondary" className="mb-3">
          {isAr ? article.categoryAr : article.category}
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">
          {isAr ? article.titleAr : article.titleEn}
        </h1>

        <div className="space-y-4">
          {(isAr ? article.contentAr : article.contentEn).map((para, i) => (
            <p key={i} className="text-sm text-muted-foreground leading-relaxed">
              {para}
            </p>
          ))}
        </div>

        <div className="mt-8 bg-gradient-to-br from-violet-500/10 to-orange-500/10 border rounded-2xl p-6 text-center">
          <h3 className="font-semibold text-sm mb-2">
            {isAr ? "جرب الحاسبات ذات الصلة" : "Try Related Calculators"}
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            {isAr ? "استخدم الحاسبات العملية في المنصة" : "Use the practical calculators in the platform"}
          </p>
          <Button onClick={() => router.push("/")} size="sm">
            {isAr ? "تصفح الحاسبات" : "Browse Calculators"}
          </Button>
        </div>
      </div>
    </div>
  );
}
