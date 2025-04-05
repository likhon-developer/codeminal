import pytest
from hypothesis import given, strategies as st, settings, HealthCheck
from src.cli.processor import CLIProcessor
from src.core.types import ProjectBlueprint

@pytest.mark.integration
class TestCLIProcessor:
    @pytest.fixture(scope="class")
    def processor(self):
        return CLIProcessor(config_path="test_config.json")
    
    def test_process_command(self, processor):
        result = processor.process_command("init --modern")
        assert result.success is True
        assert result.project_type == "modern"
        
    @settings(suppress_health_check=[HealthCheck.function_scoped_fixture])
    @given(st.text(min_size=1, max_size=100).filter(lambda x: len(x.strip()) > 0))
    def test_process_dynamic_input(self, processor, command_input):
        """Test CLI processor with hypothesis-generated inputs"""
        try:
            result = processor.process_command(command_input)
            assert isinstance(result.blueprint, ProjectBlueprint) or result.success
        except ValueError as e:
            assert "Invalid command" in str(e)
            
    def test_project_generation(self, processor):
        """Test full project generation flow"""
        blueprint = processor.generate_blueprint("create-react-app")
        result = processor.execute_blueprint(blueprint)
        
        assert result.files_created > 0
        assert result.error_count == 0
        assert result.performance_score >= 90
        
    @pytest.mark.slow
    def test_ai_integration(self, processor):
        """Test integration with AI components"""
        suggestion = processor.get_ai_suggestion("optimize code")
        assert suggestion.confidence >= 0.8
        assert len(suggestion.improvements) > 0