
        // Emission factors adjusted for Peru
        const FACTORS = {
            // Energy (Peru has ~50% hydroelectric, lower emissions than global average)
            electricity: 0.18, // kg CO2 per kWh (Peru's grid mix)
            gas: 2.0, // kg CO2 per m³
            water: 0.35, // kg CO2 per m³ (treatment and distribution)
            
            // Transport (km -> kg CO2)
            vehicle: {
                none: 0,
                motorcycle: 0.06,
                small: 0.12,
                medium: 0.15,
                large: 0.20,
                diesel: 0.17
            },
            publicTransport: 0.05, // per km estimated (buses in Lima)
            flight: 250, // kg CO2 per flight (average)
            
            // Diet (annual kg CO2)
            diet: {
                'high-meat': 2500,
                'medium-meat': 1900,
                'low-meat': 1500,
                'pescatarian': 1200,
                'vegetarian': 1000,
                'vegan': 800
            },
            
            // Consumption
            clothing: {
                low: 120,
                medium: 350,
                high: 600,
                'very-high': 900
            },
            electronics: {
                low: 100,
                medium: 250,
                high: 450,
                'very-high': 700
            },
            streaming: 55, // kg CO2 per year per hour daily
            
            // Recycling savings (annual kg CO2 saved)
            recycling: {
                plastic: 180,
                paper: 230,
                glass: 80,
                metal: 160,
                electronics: 150,
                textiles: 120,
                compost: 200,
                reusable: 90
            }
        };

        function calculateCarbon() {
            // Get all input values
            const electricity = parseFloat(document.getElementById('electricity').value) || 0;
            const gas = parseFloat(document.getElementById('gas').value) || 0;
            const water = parseFloat(document.getElementById('water').value) || 0;
            
            const vehicleType = document.getElementById('vehicleType').value;
            const carKm = parseFloat(document.getElementById('carKm').value) || 0;
            const publicTransport = parseFloat(document.getElementById('publicTransport').value) || 0;
            const flights = parseFloat(document.getElementById('flights').value) || 0;
            
            const diet = document.getElementById('diet').value;
            const foodWaste = parseFloat(document.getElementById('foodWaste').value) || 0;
            const localFood = document.getElementById('localFood').value;
            
            const clothing = document.getElementById('clothing').value;
            const electronics = document.getElementById('electronics').value;
            const streaming = parseFloat(document.getElementById('streaming').value) || 0;
            
            // Recycling
            const recyclePlastic = document.getElementById('recyclePlastic').checked;
            const recyclePaper = document.getElementById('recyclePaper').checked;
            const recycleGlass = document.getElementById('recycleGlass').checked;
            const recycleMetal = document.getElementById('recycleMetal').checked;
            const recycleElectronics = document.getElementById('recycleElectronics').checked;
            const recycleTextiles = document.getElementById('recycleTextiles').checked;
            const compost = document.getElementById('compost').checked;
            const reusable = document.getElementById('reusable').checked;

            // Calculate emissions by category
            
            // 1. ENERGY
            let energyEmissions = (electricity * FACTORS.electricity * 12) + 
                                 (gas * FACTORS.gas * 12) + 
                                 (water * FACTORS.water * 12);
            
            // 2. TRANSPORT
            let transportEmissions = (carKm * FACTORS.vehicle[vehicleType] * 12) + 
                                    (publicTransport * 20 * FACTORS.publicTransport * 52) + // 20km per day average
                                    (flights * FACTORS.flight);
            
            // 3. FOOD
            let foodEmissions = FACTORS.diet[diet];
            
            // Food waste penalty
            foodEmissions += (foodEmissions * (foodWaste / 100));
            
            // Local food discount
            const localDiscount = {
                'low': 1.0,
                'medium': 0.90,
                'high': 0.80,
                'very-high': 0.70
            };
            foodEmissions *= localDiscount[localFood];
            
            // 4. CONSUMPTION
            let consumptionEmissions = FACTORS.clothing[clothing] + 
                                      FACTORS.electronics[electronics] + 
                                      (streaming * FACTORS.streaming);
            
            // 5. RECYCLING SAVINGS
            let recyclingSavings = 0;
            if (recyclePlastic) recyclingSavings += FACTORS.recycling.plastic;
            if (recyclePaper) recyclingSavings += FACTORS.recycling.paper;
            if (recycleGlass) recyclingSavings += FACTORS.recycling.glass;
            if (recycleMetal) recyclingSavings += FACTORS.recycling.metal;
            if (recycleElectronics) recyclingSavings += FACTORS.recycling.electronics;
            if (recycleTextiles) recyclingSavings += FACTORS.recycling.textiles;
            if (compost) recyclingSavings += FACTORS.recycling.compost;
            if (reusable) recyclingSavings += FACTORS.recycling.reusable;

            // Total emissions before recycling
            const totalBeforeRecycling = energyEmissions + transportEmissions + foodEmissions + consumptionEmissions;
            
            // Final total
            const totalEmissions = Math.round(totalBeforeRecycling - recyclingSavings);
            
            // Round individual categories
            energyEmissions = Math.round(energyEmissions);
            transportEmissions = Math.round(transportEmissions);
            foodEmissions = Math.round(foodEmissions);
            consumptionEmissions = Math.round(consumptionEmissions);
            recyclingSavings = Math.round(recyclingSavings);

            // Calculate percentages
            const energyPercent = Math.round((energyEmissions / totalBeforeRecycling) * 100);
            const transportPercent = Math.round((transportEmissions / totalBeforeRecycling) * 100);
            const foodPercent = Math.round((foodEmissions / totalBeforeRecycling) * 100);
            const consumptionPercent = Math.round((consumptionEmissions / totalBeforeRecycling) * 100);

            // Display results
            document.getElementById('totalEmissions').textContent = totalEmissions.toLocaleString();
            document.getElementById('energyEmissions').textContent = energyEmissions.toLocaleString();
            document.getElementById('transportEmissions').textContent = transportEmissions.toLocaleString();
            document.getElementById('foodEmissions').textContent = foodEmissions.toLocaleString();
            document.getElementById('consumptionEmissions').textContent = consumptionEmissions.toLocaleString();
            document.getElementById('recyclingSavings').textContent = recyclingSavings.toLocaleString();

            // Display percentages
            document.getElementById('energyPercent').textContent = energyPercent;
            document.getElementById('transportPercent').textContent = transportPercent;
            document.getElementById('foodPercent').textContent = foodPercent;
            document.getElementById('consumptionPercent').textContent = consumptionPercent;

            // Update bar chart
            document.getElementById('energyBar').textContent = energyEmissions.toLocaleString() + ' kg';
            document.getElementById('transportBar').textContent = transportEmissions.toLocaleString() + ' kg';
            document.getElementById('foodBar').textContent = foodEmissions.toLocaleString() + ' kg';
            document.getElementById('consumptionBar').textContent = consumptionEmissions.toLocaleString() + ' kg';

            document.getElementById('energyBarWidth').style.width = energyPercent + '%';
            document.getElementById('transportBarWidth').style.width = transportPercent + '%';
            document.getElementById('foodBarWidth').style.width = foodPercent + '%';
            document.getElementById('consumptionBarWidth').style.width = consumptionPercent + '%';

            // Comparison with average Peruvian
            const avgPeruEmissions = 2000; // kg CO2 per capita in Peru
            let comparisonText = '';
            if (totalEmissions < avgPeruEmissions * 0.7) {
                comparisonText = '🌟 ¡Excelente! Estás muy por debajo del promedio peruano';
            } else if (totalEmissions < avgPeruEmissions) {
                comparisonText = '👍 Estás por debajo del promedio peruano';
            } else if (totalEmissions < avgPeruEmissions * 1.3) {
                comparisonText = '⚠️ Estás ligeramente por encima del promedio peruano';
            } else {
                comparisonText = '🔴 Tu huella es significativamente mayor al promedio peruano';
            }
            document.getElementById('comparison').textContent = comparisonText;

            // Equivalence calculations
            const treesNeeded = Math.round(totalEmissions / 21); // 1 tree absorbs ~21kg CO2/year
            document.getElementById('equivalence').textContent = `${treesNeeded} árboles para absorber estas emisiones anuales`;

            // Generate recommendations
            generateRecommendations({
                electricity, gas, water, vehicleType, carKm, publicTransport, flights,
                diet, foodWaste, localFood, clothing, electronics, streaming,
                recyclePlastic, recyclePaper, recycleGlass, recycleMetal, 
                recycleElectronics, recycleTextiles, compost, reusable,
                energyEmissions, transportEmissions, foodEmissions, consumptionEmissions
            });

            // Show results
            document.getElementById('results').classList.remove('hidden');
            document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        function generateRecommendations(data) {
            const recommendations = [];

            // Energy recommendations
            if (data.electricity > 350) {
                recommendations.push({
                    icon: '💡',
                    title: 'Reduce tu consumo eléctrico',
                    text: 'Tu consumo de electricidad es alto. Cambia a focos LED, desconecta aparatos en standby y usa electrodomésticos eficientes.',
                    impact: 'Alto',
                    color: 'yellow'
                });
            }

            if (data.gas > 60) {
                recommendations.push({
                    icon: '🔥',
                    title: 'Optimiza el uso de gas',
                    text: 'Considera usar una cocina de inducción o solar. Mantén tu calentador en buen estado.',
                    impact: 'Medio',
                    color: 'orange'
                });
            }

            // Transport recommendations
            if (data.vehicleType !== 'none' && data.carKm > 600) {
                recommendations.push({
                    icon: '🚲',
                    title: 'Reduce el uso del vehículo',
                    text: 'Intenta compartir auto, usar transporte público, bicicleta o caminar para distancias cortas. Considera un vehículo híbrido o eléctrico.',
                    impact: 'Alto',
                    color: 'blue'
                });
            }

            if (data.publicTransport < 3) {
                recommendations.push({
                    icon: '🚌',
                    title: 'Usa más el transporte público',
                    text: 'El Metropolitano y corredores complementarios tienen menor huella que vehículos privados.',
                    impact: 'Medio',
                    color: 'blue'
                });
            }

            if (data.flights > 3) {
                recommendations.push({
                    icon: '✈️',
                    title: 'Limita los vuelos',
                    text: 'Los vuelos tienen un gran impacto. Considera videoconferencias o turismo local.',
                    impact: 'Alto',
                    color: 'blue'
                });
            }

            // Food recommendations
            if (data.diet === 'high-meat') {
                recommendations.push({
                    icon: '🥗',
                    title: 'Reduce el consumo de carne',
                    text: 'La producción de carne genera muchas emisiones. Intenta tener días sin carne o reduce las porciones.',
                    impact: 'Alto',
                    color: 'red'
                });
            }

            if (data.foodWaste > 15) {
                recommendations.push({
                    icon: '🗑️',
                    title: 'Reduce el desperdicio de comida',
                    text: 'Planifica tus compras, almacena correctamente y aprovecha sobras. El desperdicio de comida es responsable del 8% de emisiones globales.',
                    impact: 'Medio',
                    color: 'red'
                });
            }

            if (data.localFood === 'low') {
                recommendations.push({
                    icon: '🌽',
                    title: 'Compra productos locales y de estación',
                    text: 'Los productos locales reducen las emisiones del transporte. Visita mercados locales y bioferias.',
                    impact: 'Medio',
                    color: 'green'
                });
            }

            // Consumption recommendations
            if (data.clothing === 'high' || data.clothing === 'very-high') {
                recommendations.push({
                    icon: '👕',
                    title: 'Reduce la compra de ropa nueva',
                    text: 'La moda rápida tiene gran impacto ambiental. Compra ropa de segunda mano, intercambia o repara la que tienes.',
                    impact: 'Medio',
                    color: 'purple'
                });
            }

            if (data.electronics === 'high' || data.electronics === 'very-high') {
                recommendations.push({
                    icon: '📱',
                    title: 'Alarga la vida de tus dispositivos',
                    text: 'Repara en lugar de reemplazar. Compra productos reacondicionados cuando sea posible.',
                    impact: 'Medio',
                    color: 'purple'
                });
            }

            // Recycling recommendations
            if (!data.recyclePlastic) {
                recommendations.push({
                    icon: '♻️',
                    title: 'Empieza a reciclar plástico',
                    text: 'Separar el plástico puede ahorrar hasta 180 kg de CO₂ al año. Busca puntos de reciclaje en tu distrito.',
                    impact: 'Alto',
                    color: 'teal'
                });
            }

            if (!data.recyclePaper) {
                recommendations.push({
                    icon: '📄',
                    title: 'Recicla papel y cartón',
                    text: 'El reciclaje de papel ahorra energía y reduce 230 kg de CO₂ anuales. Es uno de los materiales más fáciles de reciclar.',
                    impact: 'Alto',
                    color: 'teal'
                });
            }

            if (!data.compost) {
                recommendations.push({
                    icon: '🌱',
                    title: 'Comienza con el compostaje',
                    text: 'Los residuos orgánicos en rellenos sanitarios generan metano. El compost reduce hasta 200 kg de CO₂ al año.',
                    impact: 'Alto',
                    color: 'green'
                });
            }

            if (!data.reusable) {
                recommendations.push({
                    icon: '🛍️',
                    title: 'Usa bolsas y envases reutilizables',
                    text: 'Evita plásticos de un solo uso. Lleva tu propia bolsa, botella y envases.',
                    impact: 'Medio',
                    color: 'teal'
                });
            }

            // Priority recommendations based on highest emissions
            const categories = [
                { name: 'energía', value: data.energyEmissions },
                { name: 'transporte', value: data.transportEmissions },
                { name: 'alimentación', value: data.foodEmissions },
                { name: 'consumo', value: data.consumptionEmissions }
            ];
            
            categories.sort((a, b) => b.value - a.value);
            
            if (categories[0].value > 800) {
                recommendations.unshift({
                    icon: '🎯',
                    title: `Prioridad: Reduce emisiones de ${categories[0].name}`,
                    text: `Esta categoría representa tu mayor impacto (${categories[0].value} kg CO₂/año). Enfócate aquí para resultados rápidos.`,
                    impact: 'Crítico',
                    color: 'red'
                });
            }

            // Positive reinforcement
            const recyclingCount = [data.recyclePlastic, data.recyclePaper, data.recycleGlass, 
                                   data.recycleMetal, data.recycleElectronics, data.recycleTextiles, 
                                   data.compost, data.reusable].filter(Boolean).length;
            
            if (recyclingCount >= 5) {
                recommendations.unshift({
                    icon: '🌟',
                    title: '¡Excelente trabajo reciclando!',
                    text: `Estás reciclando ${recyclingCount} tipos de materiales. Sigue así y motiva a otros a hacer lo mismo.`,
                    impact: 'Positivo',
                    color: 'green'
                });
            }

            // Display recommendations
            const container = document.getElementById('recommendations');
            container.innerHTML = recommendations.slice(0, 8).map(rec => `
                <div class="flex items-start gap-4 p-5 bg-${rec.color}-50 rounded-lg border-l-4 border-${rec.color}-400">
                    <span class="text-3xl flex-shrink-0">${rec.icon}</span>
                    <div class="flex-1">
                        <h4 class="font-semibold text-gray-800 mb-1">${rec.title}</h4>
                        <p class="text-gray-700 text-sm">${rec.text}</p>
                        <span class="inline-block mt-2 text-xs font-semibold px-3 py-1 bg-white rounded-full text-${rec.color}-700">
                            Impacto: ${rec.impact}
                        </span>
                    </div>
                </div>
            `).join('');
        }