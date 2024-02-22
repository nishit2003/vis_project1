
document.getElementById('attributeForm').addEventListener('submit', function(event) {
   event.preventDefault(); // Prevent form submission
 
   const attributeNames = {
      poverty_perc: 'Poverty Percentage',
      median_household_income: 'Median Household Income',
      education_less_than_high_school_percent: 'Education Less Than High School Percentage',
      air_quality: 'Air Quality',
      park_access: 'Park Access',
      percent_inactive: 'Percent Inactive',
      percent_smoking: 'Percent Smoking',
      urban_rural_status: 'Urban Rural Status',
      elderly_percentage: 'Elderly Percentage',
      number_of_hospitals: 'Number of Hospitals',
      number_of_primary_care_physicians: 'Number of Primary Care Physicians',
      percent_no_heath_insurance: 'Percent No Health Insurance',
      percent_high_blood_pressure: 'Percent High Blood Pressure',
      percent_coronary_heart_disease: 'Percent Coronary Heart Disease',
      percent_stroke: 'Percent Stroke',
      percent_high_cholesterol: 'Percent High Cholesterol',
  };

   // Get selected attribute values
   var attribute1 = document.getElementById('attributesSelect1').value;
   var attribute2 = document.getElementById('attributesSelect2').value;
 
   // Update header with selected attributes
   document.getElementById('dashboardTitle').textContent = `US Health Dashboard - ${attributeNames[attribute1]} vs ${attributeNames[attribute2]}`;
 });
 

