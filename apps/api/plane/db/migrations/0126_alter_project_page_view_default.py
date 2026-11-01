# Generated manually for StringX Phase 1 (page_view default off).

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("db", "0125_reset_project_deploy_board_identity"),
    ]

    operations = [
        migrations.AlterField(
            model_name="project",
            name="page_view",
            field=models.BooleanField(default=False),
        ),
    ]
