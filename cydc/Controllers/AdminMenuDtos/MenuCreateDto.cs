using cydc.Database;
using System;

namespace cydc.Controllers.AdminMenuDtos
{
    public class MenuCreateDto
    {
        public string Title { get; set; }

        public string Details { get; set; }

        public decimal Price { get; set; }

        public FoodMenu ToFoodMenu()
        {
            return new FoodMenu
            {
                Title = this.Title, 
                Details = this.Details, 
                Price = this.Price,
                Enabled = true, 
                CreateTime = DateTime.Now, 
            };
        }
    }
}
