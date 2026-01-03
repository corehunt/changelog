'use client';

import {useState} from 'react';
import {THEME} from '@/lib/theme';
import {Check, ChevronDown} from 'lucide-react';

const AVAILABLE_TECHNOLOGIES = [
    'TypeScript',
    'JavaScript',
    'Python',
    'Go',
    'Java',
    'Rust',
    'React',
    'Next.js',
    'Node.js',
    'Express',
    'Vue.js',
    'Angular',
    'PostgreSQL',
    'MongoDB',
    'Redis',
    'MySQL',
    'DynamoDB',
    'OAuth 2.0',
    'WebSocket',
    'REST API',
    'GraphQL',
    'Docker',
    'Kubernetes',
    'AWS',
    'Azure',
    'GCP',
    'Nginx',
    'Apache',
    'TensorFlow',
    'PyTorch',
    'MLflow',
    'Windsurf AI',
    'COBOL',
    'Spring Boot',
    'DB2',
    'Prometheus',
    'Grafana',
    'ElasticSearch',
    'RabbitMQ',
    'Kafka',
    'Git',
    'CI/CD',
    'Terraform',
    'Ansible',
].sort();

interface TechnologySelectorProps {
    selectedTechnologies: string[];
    onChange: (technologies: string[]) => void;
}

export function TechnologySelector({selectedTechnologies, onChange}: TechnologySelectorProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleTechnology = (tech: string) => {
        if (selectedTechnologies.includes(tech)) {
            onChange(selectedTechnologies.filter((t) => t !== tech));
        } else {
            onChange([...selectedTechnologies, tech]);
        }
    };

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-3 font-mono text-sm flex items-center justify-between"
                style={{
                    backgroundColor: THEME.colors.surface.elevated,
                    color: THEME.colors.text.primary,
                    border: `1px solid ${THEME.colors.border.subtle}`,
                    borderRadius: THEME.borderRadius.input,
                }}
            >
        <span className="flex-1 text-left">
          {selectedTechnologies.length > 0
              ? `${selectedTechnologies.length} selected`
              : 'Select technologies'}
        </span>
                <ChevronDown
                    size={16}
                    style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                    }}
                />
            </button>

            {selectedTechnologies.length > 0 && (
                <div
                    className="mt-2 flex flex-wrap gap-2"
                >
                    {selectedTechnologies.map((tech) => (
                        <span
                            key={tech}
                            className="px-3 py-1 text-xs font-mono"
                            style={{
                                backgroundColor: THEME.colors.surface.elevated,
                                color: THEME.colors.text.primary,
                                border: `1px solid ${THEME.colors.border.subtle}`,
                                borderRadius: THEME.borderRadius.input,
                            }}
                        >
              {tech}
            </span>
                    ))}
                </div>
            )}

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div
                        className="absolute z-20 w-full mt-1 max-h-64 overflow-y-auto"
                        style={{
                            backgroundColor: THEME.colors.background.secondary,
                            border: `1px solid ${THEME.colors.border.subtle}`,
                            borderRadius: THEME.borderRadius.input,
                        }}
                    >
                        {AVAILABLE_TECHNOLOGIES.map((tech) => {
                            const isSelected = selectedTechnologies.includes(tech);
                            return (
                                <button
                                    key={tech}
                                    type="button"
                                    onClick={() => toggleTechnology(tech)}
                                    className="w-full px-4 py-2 font-mono text-sm flex items-center justify-between hover:opacity-70 transition-opacity"
                                    style={{
                                        color: THEME.colors.text.primary,
                                        borderBottom: `1px solid ${THEME.colors.border.hairline}`,
                                    }}
                                >
                                    <span>{tech}</span>
                                    {isSelected && (
                                        <Check size={16} style={{color: THEME.colors.text.secondary}}/>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}
