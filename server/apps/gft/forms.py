from django import forms
from .models import BoxCategory, CompanyBoxes, Company
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model

User = get_user_model()

class AdminCompanyForm(forms.ModelForm):
    class Meta:
        model = Company
        fields = "__all__"

    def clean(self):
        cleaned_data = super().clean()
        company = self.instance

        if not company.pk:  # Check if the record is being created
            self.reduce_box_category_qty()

        return cleaned_data

    def reduce_box_category_qty(self):
        company_boxes_formset = self.get_inline_formset(
            CompanyBoxes, self.instance, self.data)

        for form in company_boxes_formset:
            if form.is_valid():
                box_type = form.cleaned_data.get('box_type')
                qty = form.cleaned_data.get('qty')

                if box_type is not None:
                    try:
                        box_category = BoxCategory.objects.get(id=box_type.id)

                        if box_category.qty < qty:
                            self.add_error(None, ValidationError(
                                f"Not enough boxes available for {box_category.category} days box category."))
                            return  # Return to prevent saving
                        else:
                            box_category.qty -= qty
                            box_category.save()

                    except BoxCategory.DoesNotExist:
                        pass

    @staticmethod
    def get_inline_formset(inline_model, instance, data):
        inline_formset_factory = forms.inlineformset_factory(
            Company, inline_model, fields=('box_type', 'qty'))
        return inline_formset_factory(instance=instance, data=data)
